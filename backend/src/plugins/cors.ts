import fp from 'fastify-plugin';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';

export default fp<FastifyCorsOptions>((fastify) => {
  fastify.register(fastifyCors, {
    origin: 'https://chatroom-3yb.pages.dev/',
    methods: ['GET', 'POST'],
  });
});
