import { Injectable } from '@nestjs/common';
import mammoth from 'mammoth';
import { DocumentParser } from './parser.interface';

@Injectable()
export class WordParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  }
}
