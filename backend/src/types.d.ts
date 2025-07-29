import { $Enums } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<VerifyPayloadType | undefined>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      name: string;
    }; // user type is return type of `request.user` object
  }
}

interface LoginBody {
  password: string;
}

interface TokenQuery {
  token: string;
}

interface TokenPayload extends object {
  name: $Enums.User;
}

export { LoginBody, TokenQuery, TokenPayload };
