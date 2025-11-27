import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { linkRoutes } from "./routes/link";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((err, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
        return reply.status(400).send({
            message: 'Validation error',
            issues: err.validation
        })
    }

    console.error(err);
    return reply.status(500).send({message: 'Internal server error'})
})

server.register(fastifyCors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
});

server.register(linkRoutes);

server.listen({port: 3333, host: '0.0.0.0'}).then(() => {
    console.log('HTTP server running!')
});
