import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient, Subscription_Plan } from './generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const planData = [
    {
      name: Subscription_Plan.FREE,
      description: 'Free plan with limited features',
      price: 0.0,
    },
    {
      name: Subscription_Plan.PRO,
      description: 'Pro plan with advanced features',
      price: 19.99,
    },
    {
      name: Subscription_Plan.ENTERPRISE,
      description: 'Enterprise plan with full features',
      price: 49.99,
    },
  ];

  for (const plan of planData) {
    await prisma.plan.create({
      data: {
        name: plan.name as Subscription_Plan,
        description: plan.description,
        price: plan.price,
      },
    });
  }

  console.log('Plan data seeded successfully');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
