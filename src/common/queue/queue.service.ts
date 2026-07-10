import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName } from '../constants';

export interface JobData {
  documentId: String;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueName.DOCUMENT_QUEUE)
    private readonly documentQueue: Queue,
  ) {}

  async processFile(data: JobData) {
    await this.documentQueue.add('process-file', data, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
