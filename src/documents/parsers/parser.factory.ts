import { BadRequestException, Injectable } from '@nestjs/common';
import { FILE_TYPES } from 'src/common/constants';
import { CsvParser } from './csv.parser';
import { ExcelParser } from './excel.parser';
import { DocumentParser } from './parser.interface';
import { PdfParser } from './pdf.parser';
import { TextParser } from './text.parser';
import { WordParser } from './word.parser';

@Injectable()
export class ParserFactory {
  private readonly parsers = new Map<string, DocumentParser>();

  constructor(
    private readonly pdfParser: PdfParser,
    private readonly wordParser: WordParser,
    private readonly textParser: TextParser,
    private readonly csvParser: CsvParser,
    private readonly excelParser: ExcelParser,
  ) {
    this.registerParsers();
  }

  private registerParsers(): void {
    [
      [FILE_TYPES.PDF, this.pdfParser],

      [FILE_TYPES.DOC, this.wordParser],
      [FILE_TYPES.DOCX, this.wordParser],

      [FILE_TYPES.TXT, this.textParser],
      [FILE_TYPES.MARKDOWN, this.textParser],

      [FILE_TYPES.CSV, this.csvParser],

      [FILE_TYPES.XLS, this.excelParser],
      [FILE_TYPES.XLSX, this.excelParser],
    ].forEach(([mimeType, parser]) => {
      this.parsers.set(mimeType as string, parser as DocumentParser);
    });
  }

  get(mimeType: string): DocumentParser {
    const parser = this.parsers.get(mimeType);

    if (!parser) {
      throw new BadRequestException(`Unsupported mime type: ${mimeType}`);
    }

    return parser;
  }
}
