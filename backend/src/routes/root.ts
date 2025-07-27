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
        const payload = {
          user,
          test: 'hello',
        };
        const token = fastify.jwt.sign(payload);
        const body = {
          message: 'login successful',
          user,
          token,
        };
        return reply.send(body);
      }

      return reply.code(400).send({ message: 'Invalid password' });
    },
  );

  fastify.get('/chat', { websocket: true }, (socket, request) => {
    const { clients } = fastify.websocketServer;
    console.log(request.query);

    socket.on('message', (message) => {
      console.log(message.toString());
      // broadcast to all clients except self
      for (const client of clients) {
        if (client !== socket) {
          client.send(message.toString());
        }
      }
    });
  });
};

export default root;
