import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ChunkService } from './chunk/chunk.service';
import { EmbeddingService } from './embedding/embedding.service';

@Injectable()
export class AiService {
  constructor(
    private readonly chunkService: ChunkService,
    private readonly embeddingService: EmbeddingService,
    private readonly prismaService: PrismaService,
  ) {}
  async processForLLM(text: string, documentId: string): Promise<void> {
    // 1. Split document into chunks
    const chunks = await this.chunkService.split(text);

    if (!chunks.length) {
      return;
    }

    // 2. Generate embeddings
    const embeddings = await this.embeddingService.embedDocuments(
      chunks.map((chunk) => chunk.content),
    );

    // 3. Remove old chunks (Re-processing support)
    await this.prismaService.documentChunk.deleteMany({
      where: {
        documentId,
      },
    });

    // 4. Save chunks + embeddings in one transaction
    await this.prismaService.$transaction(
      chunks.map((chunk, index) =>
        this.prismaService.documentChunk.create({
          data: {
            documentId,
            chunkIndex: chunk.index,
            content: chunk.content,
            embedding: embeddings[index],
          },
        }),
      ),
    );
  }
}
