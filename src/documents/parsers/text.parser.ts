import { Injectable } from '@nestjs/common';
import { DocumentParser } from './parser.interface';

@Injectable()
export class TextParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<string> {
    return buffer.toString('utf8');
  }
}
