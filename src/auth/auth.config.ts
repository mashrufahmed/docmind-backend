import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { PrismaClient } from 'src/common/prisma/generated/prisma/client';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(PrismaClient, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production', // HTTPS only
    cookiePrefix: 'sass',
  },

  trustedOrigins: [
    'http://localhost:3000', // production URL
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
