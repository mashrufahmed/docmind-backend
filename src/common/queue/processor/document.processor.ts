import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job as J } from 'bullmq';
import { QueueName } from 'src/common/constants';
import { DocumentsService } from 'src/documents/documents.service';
import { JobData } from '../queue.service';

@Processor(QueueName.DOCUMENT_QUEUE)
export class DocumentProcessor extends WorkerHost {
  constructor(private readonly documentService: DocumentsService) {
    super();
  }
  async process(job: J<JobData>) {
    return await this.documentService.processDocument(job);
  }
}
