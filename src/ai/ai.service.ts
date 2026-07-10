import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ChunkService } from './chunk/chunk.service';
import { EmbeddingService } from './embedding/embedding.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly chunkService: ChunkService,
    private readonly embeddingService: EmbeddingService,
    private readonly prismaService: PrismaService,
  ) {}

  async processForLLM(text: string, documentId: string): Promise<void> {
    // 1. Split document into chunks
    const chunks = await this.chunkService.split(text);

    if (!chunks.length) {
      this.logger.warn(`No chunks produced for document ${documentId}`);
      return;
    }


    // 2. Generate embeddings
    const embeddings = await this.embeddingService.embedDocuments(
      chunks.map((chunk) => chunk.content),
    );

    if (embeddings.length !== chunks.length) {
      throw new Error(
        `Embedding count (${embeddings.length}) does not match chunk count (${chunks.length}) for document ${documentId}`,
      );
    }

    // 3 & 4. Replace old chunks with new ones atomically.
    //
    // `embedding` is Unsupported("vector") in schema.prisma — Prisma Client
    // excludes it from generated types entirely, so it can NEVER be written
    // through .create()/.createMany(). Every insert has to go through
    // $executeRaw with an explicit ::vector cast.
    await this.prismaService.$transaction([
      this.prismaService.documentChunk.deleteMany({ where: { documentId } }),
      ...chunks.map((chunk, index) => {
        const vectorLiteral = JSON.stringify(embeddings[index]);

        return this.prismaService.$executeRaw`
          INSERT INTO document_chunk (id, "documentId", "chunkIndex", content, embedding, "createdAt")
          VALUES (${randomUUID()}, ${documentId}, ${chunk.index}, ${chunk.content}, ${vectorLiteral}::vector, NOW())
        `;
      }),
    ]);

    this.logger.log(
      `Stored ${chunks.length} chunks with embeddings for document ${documentId}`,
    );
  }
}
