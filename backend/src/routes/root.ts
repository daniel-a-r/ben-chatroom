import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';

interface LoginBody {
  password: string;
}

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async function (_request, _reply) {
    return { root: true };
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
    (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      console.log('login endpoint reached');
      const { password } = request.body;
      let user: string = '';
      if (password === 'shannon') {
        user = 'shannon';
      } else if (password === 'kat') {
        user = 'kat';
      } else {
        return reply.code(400).send({ message: 'Invalid password' });
      }
      return reply.send({ message: 'login successful', user });
    },
  );
};

export default root;
