import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaymentModule } from 'src/payment/payment.module';
import { PaymentService } from 'src/payment/payment.service';
import { BAuthService } from './b-auth.service';

@Module({
  imports: [PaymentModule],
  providers: [BAuthService, PaymentService, PrismaService],
  exports: [BAuthService],
})
export class BAuthModule {}
