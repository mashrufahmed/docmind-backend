import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable } from '@nestjs/common';

export interface Chunk {
  index: number;
  content: string;
}

@Injectable()
export class ChunkService {
  private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150,
  });

  async split(text: string): Promise<Chunk[]> {
    const chunks = await this.splitter.splitText(text);
    return chunks
      .filter((chunk) => chunk.trim().length > 30)
      .map((content, index) => ({
        index,
        content,
      }));
  }
}
