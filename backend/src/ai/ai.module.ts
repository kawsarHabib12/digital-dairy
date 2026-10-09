import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { MemoryEmbedding } from './entities/memory-embedding.entity';
import { Memory } from '../memories/entities/memory.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { GeminiProvider } from './providers/gemini.provider';
import { MockAiProvider } from './providers/mock.provider';

@Module({
  imports: [TypeOrmModule.forFeature([AiAnalysis, MemoryEmbedding, Memory])],
  controllers: [AiController],
  providers: [AiService, GeminiProvider, MockAiProvider],
  exports: [AiService],
})
export class AiModule {}
