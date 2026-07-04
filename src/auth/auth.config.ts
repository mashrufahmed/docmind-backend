import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { PrismaService } from 'src/common/prisma/prisma.service';


export const auth = (prisma: PrismaService, config: ConfigService) =>
  betterAuth({
    appName: config.getOrThrow('APP_NAME'),
    secret: config.getOrThrow('BETTER_AUTH_SECRET'),
    baseURL: config.getOrThrow('BETTER_AUTH_BASE_URL'),

    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),

    plugins: [organization()],

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },

    advanced: {
      useSecureCookies: process.env.NODE_ENV === 'production', // HTTPS only
      cookiePrefix: 'docmind',
    },

    trustedOrigins: [config.getOrThrow('FRONTEND_URL')],

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
  });
// export const auth = betterAuth({
//   appName: process.env.APP_NAME,
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_BASE_URL,

//   database: prismaAdapter(PrismaClient, {
//     provider: 'postgresql',
//   }),

//   plugins: [organization()],

//   emailAndPassword: {
//     enabled: true,
//     minPasswordLength: 8,
//   },

//   advanced: {
//     useSecureCookies: process.env.NODE_ENV === 'production', // HTTPS only
//     cookiePrefix: 'docmind',
//   },

//   trustedOrigins: [process.env.FRONTEND_URL!],

//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     updateAge: 60 * 60 * 24, // 1 day
//   },
// });
