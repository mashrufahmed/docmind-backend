import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class BAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
    private readonly prismaService: PrismaService,
  ) {}
  async createStripeCustomer({
    email,
    name,
    organizationId,
  }: {
    email: string;
    name: string;
    organizationId: string;
  }) {
    const customer = await this.paymentService.createStripeCustomer({
      email,
      name,
    });
    const createCustomerInDB = await this.prismaService.stripe_Account.create({
      data: {
        stripe_customer_id: customer.id,
        organizationId: organizationId,
      },
    });
    const getPlanId = await this.prismaService.plan.findFirst({
      where: {
        name: 'FREE',
      },
    });
    const createSubscriptionInDB = await this.prismaService.subscription.create(
      {
        data: {
          organizationId: organizationId,
          status: 'ACTIVE',
          planId: getPlanId?.id as string,
          stripeCustomerId: customer.id,
        },
      },
    );
  }

  async checkIfCreateOrganization({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {}
}
