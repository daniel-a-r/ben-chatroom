import Fastify, { FastifyRequest } from 'fastify';

interface LoginBody {
  password: string;
}

const fastify = Fastify({
  logger: false,
});

fastify.get('/', async (_request, _reply) => {
  console.log('server reached');
  return { hello: 'world' };
});

fastify.post(
  '/login',
  {
    schema: {
      body: {
        type: 'object',
        required: ['password'],
        properties: {
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { type: 'string' },
          },
        },
      },
    },
  },
  (request: FastifyRequest<{ Body: LoginBody }>, reply) => {
    console.log('login endpoint reached');
    const { password } = request.body;
    let user: string = '';
    if (password === 'shannon') {
      user = 'shannon';
    } else if (password === 'kat') {
      user = 'kat';
    } else {
      reply.code(400).send({ message: 'Invalid password' });
    }
    reply.send({ message: 'login successful', user });
  },
);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
