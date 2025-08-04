import fp from 'fastify-plugin';
import fastifyCors, { FastifyCorsOptions } from '@fastify/cors';

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(fastifyCors), {
    origin: {
      String: "https://chatroom-3yb.pages.dev/",
    },
    methods: ['GET', 'POST'],
  }
});
