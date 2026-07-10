import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { DocumentParser } from './parser.interface';

@Injectable()
export class ExcelParser implements DocumentParser {
  async parse(buffer: Buffer): Promise<string> {
    const workbook = XLSX.read(buffer);
    let text = '';
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      text += XLSX.utils.sheet_to_csv(sheet);
      text += '\n';
    });

    return text;
  }
}
