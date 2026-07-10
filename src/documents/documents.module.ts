import { Module } from '@nestjs/common';
import { FileService } from 'src/common/file/file.service';
import { DocumentProcessor } from '../common/queue/processor/document.processor';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentProcessor, FileService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
