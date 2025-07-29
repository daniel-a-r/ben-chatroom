import fp from 'fastify-plugin';
import jwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
  });
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        return await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  );
});
