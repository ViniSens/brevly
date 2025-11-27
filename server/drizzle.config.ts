import 'dotenv/config'; // Carrega as variáveis do .env
import type { Config } from 'drizzle-kit';

import { env } from './src/env'; // Importamos nossas variáveis validadas

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;