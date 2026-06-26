import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { PrismaClient } from 'src/common/prisma/generated/prisma/client';

export const auth = betterAuth({
  database: prismaAdapter(PrismaClient, {
    provider: 'postgresql',
  }),
});
