import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { LoginBody, TokenQuery, TokenPayload } from '../types';

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
              name: { type: 'string' },
              token: { type: 'string' },
              emojiOnly: { type: 'boolean' },
            },
          },
        },
      },
    },
    (request: FastifyRequest<{ Body: LoginBody }>, reply) => {
      const { password } = request.body;

      if (password === 'pass1' || password === 'pass2') {
        const name = password === 'pass1' ? 'SHANNON' : 'CAT';
        const emojiOnly = password === 'pass2' ? true : false;
        const payload = {
          name,
        };
        const token = fastify.jwt.sign(payload);
        const body = {
          message: 'login successful',
          name,
          token,
          emojiOnly
        };
        return reply.send(body);
      }

      return reply.code(400).send({ message: 'Invalid password' });
    },
  );

  fastify.get(
    '/history',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const { prisma } = fastify;
      const { name } = request.user;
      const messages = await prisma.message.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });

      const messagesNameHidden = messages.map((message) => {
        return {
          ...message,
          user: message.user === name ? 'me' : 'user',
        };
      });

      reply.send(messagesNameHidden);
    },
  );

  fastify.get(
    '/chat',
    { websocket: true },
    async (socket, request: FastifyRequest<{ Querystring: TokenQuery }>) => {
      const { clients } = fastify.websocketServer;
      const { prisma } = fastify;

      socket.on('message', async (message) => {
        const { token } = request.query;
        const { name } = fastify.jwt.verify<TokenPayload>(token);

        const { content, id } = await prisma.message.create({
          data: {
            user: name,
            content: message.toString(),
          },
        });
        // broadcast to all clients except self
        for (const client of clients) {
          if (client !== socket) {
            client.send(JSON.stringify({ content, id, user: 'user' }));
          }
        }
      });
    },
  );
};

export default root;
