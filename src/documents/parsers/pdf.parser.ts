import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import { DocumentParser } from './parser.interface';

@Injectable()
export class PdfParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }
}
