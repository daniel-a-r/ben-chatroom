import fp from 'fastify-plugin';
import jwt, { FastifyJWT } from '@fastify/jwt';

export default fp<FastifyJWT>(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
  });
});
