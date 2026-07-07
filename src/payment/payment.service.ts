import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: InstanceType<typeof Stripe>;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2026-06-24.dahlia',
      },
    );
  }

  async createStripeCustomer({ email, name }: { email: string; name: string }) {
    try {
      const customer = await this.stripe.customers.create({
        name: name,
        email: email,
      });
      return customer;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create Stripe customer',
      );
    }
  }
}
