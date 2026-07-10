import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { DocumentParser } from './parser.interface';

@Injectable()
export class CsvParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<string> {
    const records = parse(buffer.toString('utf8'), {
      columns: true,
      skip_empty_lines: true,
    });

    return JSON.stringify(records);
  }
}
