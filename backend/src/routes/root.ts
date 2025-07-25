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
              token: { type: 'string' },
            },
          },
        },
      },
    },
    (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      const { password } = request.body;

      if (password === 'shannon' || password === 'kat') {
        console.log('password:', password);
        const user = password;
        const token = fastify.jwt.sign({ user });
        const body = {
          message: 'login successful',
          user,
          token
        }
        return reply.send(body);
      }

      return reply.code(400).send({ message: 'Invalid password' });
    },
  );
};

export default root;
