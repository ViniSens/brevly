import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { eq, desc, sql, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { PostgresError } from 'postgres';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { env } from '../../../env';
import { r2 } from '../../storage/client';
import { links } from '../../db/schema';
import { db } from '../../db';

// 🔗 todas as rotas relacionadas a encurtamento de links
export async function linkRoutes(app: FastifyInstance) {
  /**
   * Redireciona o usuário para a URL original com base no código curto.
   * Exemplo: GET /abc123 → 301 → https://exemplo.com
   */
  app.get('/:alias', async (req, reply) => {
    const paramsSchema = z.object({ alias: z.string().min(3) });
    const { alias } = paramsSchema.parse(req.params);

    const record = await db.query.links.findFirst({
      where: eq(links.short_url, alias),
    });

    if (!record) {
      return reply.status(404).send({ message: 'URL não encontrada' });
    }

    await db
      .update(links)
      .set({ access_count: sql`${links.access_count} + 1` })
      .where(eq(links.id, record.id));

    return reply.redirect(record.original_url, 301);
  });

  /**
   * Retorna os dados de uma URL encurtada específica
   */
  app.get('/api/links/:slug', async (req, reply) => {
    const paramsSchema = z.object({ slug: z.string().min(3) });
    const { slug } = paramsSchema.parse(req.params);

    const record = await db.query.links.findFirst({
      where: eq(links.short_url, slug),
    });

    if (!record) {
      return reply.status(404).send({ message: 'Link não encontrado' });
    }

    return reply.send({
      id: record.id,
      short_url: record.short_url,
      original_url: record.original_url,
      access_count: record.access_count,
      created_at: record.created_at,
      url: `${env.CLOUDFLARE_PUBLIC_URL}/${record.short_url}`,
    });
  });

  /**
   * Incrementa manualmente a contagem de acessos de uma URL curta
   */
  app.post('/api/links/:slug/hit', async (req, reply) => {
    const schema = z.object({ slug: z.string().min(3) });
    const { slug } = schema.parse(req.params);

    const record = await db.query.links.findFirst({
      where: or(eq(links.short_url, slug)),
    });

    if (!record) {
      return reply.status(404).send({ message: 'Link não encontrado' });
    }

    await db
      .update(links)
      .set({ access_count: sql`${links.access_count} + 1` })
      .where(eq(links.id, record.id));

    return reply.send({ ok: true });
  });

  /**
   * Validação aprimorada para URLs
   */
  function isValidHttpUrl(urlString: string): boolean {
    try {
      const parsed = new URL(urlString);
      if (!['http:', 'https:'].includes(parsed.protocol)) return false;

      const invalidHosts = [
        /^localhost$/i,
        /^127\.0\.0\.1$/,
        /^0\.0\.0\.0$/,
        /^192\.168\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^\[::1\]$/,
      ];

      if (process.env.NODE_ENV === 'production' &&
          invalidHosts.some((pat) => pat.test(parsed.hostname))) {
        return false;
      }

      if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') return false;
      if (parsed.hostname.length > 253) return false;
      if (parsed.hostname.includes('..') || /[<>]/.test(parsed.hostname)) return false;

      return true;
    } catch {
      return false;
    }
  }

  // schema compartilhado de validação
  const validatedUrl = z
    .string()
    .min(1, 'Informe uma URL válida')
    .max(2048, 'URL muito longa (máx. 2048 caracteres)')
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, 'Formato inválido')
    .refine(isValidHttpUrl, 'URL não permitida')
    .transform((url) => {
      const obj = new URL(url);
      if (obj.pathname.endsWith('/') && obj.pathname !== '/') {
        obj.pathname = obj.pathname.slice(0, -1);
      }
      return obj.toString();
    });

  /**
   * Cria um novo link encurtado
   */
  app.post('/api/links', async (req, reply) => {
    const bodySchema = z.object({
      original_url: validatedUrl,
      short_url: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, hífen e underscore')
        .optional(),
      alias: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-zA-Z0-9_-]+$/, 'Alias inválido')
        .optional(),
    });

    try {
      const { original_url, short_url, alias } = bodySchema.parse(req.body);

      const cleanAlias = alias?.replace(/^brev\.ly\//, '');
      if (cleanAlias && cleanAlias.length < 3) {
        return reply.status(400).send({
          message: 'Alias deve ter ao menos 3 caracteres após remover "brev.ly/"',
        });
      }

      const finalSlug = cleanAlias || short_url || nanoid(6);

      const [inserted] = await db
        .insert(links)
        .values({
          original_url,
          short_url: finalSlug,
        })
        .returning({
          id: links.id,
          short_url: links.short_url,
          original_url: links.original_url,
          created_at: links.created_at,
          access_count: links.access_count,
        });

      return reply.status(201).send({
        ...inserted,
        alias: cleanAlias || undefined,
        short_url: `${env.CLOUDFLARE_PUBLIC_URL}/${inserted.short_url}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const detail = error.issues[0] ?? { message: 'Dados inválidos', path: ['unknown'] };
        return reply.status(400).send({ message: detail.message, field: detail.path.join('.') });
      }

      if (error instanceof PostgresError && error.code === '23505') {
        return reply.status(400).send({ message: 'Link encurtado já existente' });
      }

      return reply.status(500).send({
        message: 'Erro inesperado ao criar link',
        error,
      });
    }
  });

  /**
   * Lista paginada dos links encurtados
   */
  app.get('/api/links', async (req, reply) => {
    const querySchema = z.object({
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(10).max(100).default(10),
    });

    const { page, pageSize } = querySchema.parse(req.query);

    const records = await db
      .select({
        id: links.id,
        short_url: links.short_url,
        original_url: links.original_url,
        access_count: links.access_count,
        created_at: links.created_at,
        url: sql<string>`concat(${env.CLOUDFLARE_PUBLIC_URL}::text, '/', ${links.short_url})`,
      })
      .from(links)
      .orderBy(desc(links.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return reply.send(records);
  });

  /**
   * Remove um link existente
   */
  app.delete('/api/links/:alias', async (req, reply) => {
    const schema = z.object({ alias: z.string().min(3) });
    const { alias } = schema.parse(req.params);

    const [removed] = await db
      .delete(links)
      .where(eq(links.short_url, alias))
      .returning({ id: links.id });

    if (!removed) {
      return reply.status(404).send({ message: 'Link não encontrado' });
    }

    return reply.status(204).send();
  });

  /**
   * Exporta todas as URLs em um CSV e envia ao Cloudflare R2
   */
  app.post('/api/links/export/csv', async (_req, reply) => {
    try {
      const all = await db.select().from(links).orderBy(desc(links.created_at));

      if (all.length === 0) {
        return reply.status(400).send({ message: 'Nenhum link disponível para exportar' });
      }

      const header = 'URL original,URL encurtada,Contagem de acessos,Data de criação\n';
      const body = all
        .map((l) => `${l.original_url},${l.short_url},${l.access_count},${l.created_at.toISOString()}`)
        .join('\n');

      const file = header + body;
      const filename = `${randomUUID()}.csv`;
      console.log("passei")


      await r2.send(
        new PutObjectCommand({
          Bucket: env.CLOUDFLARE_BUCKET,
          Key: filename,
          Body: Buffer.from(file),
          ContentType: 'text/csv',
        })
      );

      const csvUrl = `${env.CLOUDFLARE_PUBLIC_URL}/${filename}`;
      return reply.status(201).send({ csvUrl });
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
      return reply.status(500).send({ message: 'Falha ao gerar o arquivo CSV' });
    }
  });
}