import Fastify from 'fastify';
import jwt from '#/plugins/jwt';
import sensible from '#/plugins/sensible';
import root from '#/routes/root';

const fastify = Fastify();

fastify.register(jwt);
fastify.register(sensible);
fastify.register(root);

// Run the server!
try {
  await fastify.listen({ port: process.env.PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
