import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ChunkService } from './chunk/chunk.service';
import { EmbeddingService } from './embedding/embedding.service';

@Module({
  controllers: [AiController],
  providers: [AiService, ChunkService, EmbeddingService],
  exports: [AiService],
})
export class AiModule {}
