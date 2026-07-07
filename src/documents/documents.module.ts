import { Module } from '@nestjs/common';
import { FileService } from 'src/common/file/file.service';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, FileService],
})
export class DocumentsModule {}
