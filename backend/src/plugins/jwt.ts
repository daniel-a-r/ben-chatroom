import fp from 'fastify-plugin';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';

export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(jwt, {
    // TODO: setup docker for env variables
    secret: 'secret',
  });
});
