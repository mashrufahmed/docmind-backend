import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth/auth.config';
import { BAuthModule } from './b-auth/b-auth.module';
import { BAuthService } from './b-auth/b-auth.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { PrismaService } from './common/prisma/prisma.service';
import { QueueModule } from './common/queue/queue.module';
import { DocumentsModule } from './documents/documents.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.getOrThrow<string>('REDIS_URL'),
        },
      }),
    }),
    PrismaModule,
    BAuthModule,
    QueueModule,
    AuthModule.forRootAsync({
      imports: [PrismaModule, ConfigModule, BAuthModule],
      inject: [PrismaService, ConfigService, BAuthService],
      useFactory: (
        prisma: PrismaService,
        config: ConfigService,
        bAuthService: BAuthService,
      ) => ({
        auth: auth(prisma, config, bAuthService),
      }),
    }),
    UserModule,
    PaymentModule,
    DocumentsModule,
  ],
})
export class AppModule {}
