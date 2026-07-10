import { Module } from '@nestjs/common';
import { FileService } from 'src/common/file/file.service';
import { DocumentProcessor } from '../common/queue/processor/document.processor';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CsvParser } from './parsers/csv.parser';
import { ExcelParser } from './parsers/excel.parser';
import { ParserFactory } from './parsers/parser.factory';
import { PdfParser } from './parsers/pdf.parser';
import { TextParser } from './parsers/text.parser';
import { WordParser } from './parsers/word.parser';

@Module({
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentProcessor,
    FileService,
    ParserFactory,
    PdfParser,
    WordParser,
    TextParser,
    CsvParser,
    ExcelParser,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
