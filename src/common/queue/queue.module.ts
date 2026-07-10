import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { DocumentsModule } from 'src/documents/documents.module';
import { QueueName } from '../constants';
import { QueueService } from './queue.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.DOCUMENT_QUEUE }),
    DocumentsModule,
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
