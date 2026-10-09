import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { MemoryEmbedding } from './entities/memory-embedding.entity';
import { Memory } from '../memories/entities/memory.entity';
import { GeminiProvider } from './providers/gemini.provider';
import { MockAiProvider } from './providers/mock.provider';
import { ILlmProvider } from './interfaces/llm-provider.interface';
import { IEmbeddingProvider } from './interfaces/embedding-provider.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly llmProvider: ILlmProvider;
  private readonly embeddingProvider: IEmbeddingProvider;

  constructor(
    @InjectRepository(AiAnalysis)
    private readonly aiAnalysisRepository: Repository<AiAnalysis>,
    @InjectRepository(MemoryEmbedding)
    private readonly embeddingRepository: Repository<MemoryEmbedding>,
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
    private readonly configService: ConfigService,
    private readonly geminiProvider: GeminiProvider,
    private readonly mockProvider: MockAiProvider,
  ) {
    const providerConfig = this.configService.get<string>('AI_PROVIDER', 'gemini');
    if (providerConfig === 'gemini') {
      this.llmProvider = this.geminiProvider;
      this.embeddingProvider = this.geminiProvider;
    } else {
      this.llmProvider = this.mockProvider;
      this.embeddingProvider = this.mockProvider;
    }
  }

  // 1. Analyze a specific memory and store AI analysis + embedding
  async analyzeMemory(userId: string, memoryId: string): Promise<AiAnalysis> {
    const memory = await this.memoryRepository.findOne({
      where: { id: memoryId, userId },
      relations: { aiAnalysis: true, category: true, tags: true },
    });

    if (!memory) {
      throw new NotFoundException(`Memory #${memoryId} not found`);
    }

    this.logger.log(`Analyzing memory #${memoryId} for user ${userId}...`);

    // Run AI analysis
    const analysisResult = await this.llmProvider.analyzeDiaryEntry(
      memory.title,
      memory.content,
    );

    // Save or update AiAnalysis record
    let analysis = await this.aiAnalysisRepository.findOne({
      where: { memoryId },
    });

    if (!analysis) {
      analysis = this.aiAnalysisRepository.create({
        memoryId,
        summary: analysisResult.summary,
        emotion: analysisResult.emotion,
        keywords: analysisResult.keywords,
        suggestedCategory: analysisResult.suggestedCategory,
        peopleMentioned: analysisResult.peopleMentioned,
        eventsMentioned: analysisResult.eventsMentioned,
      });
    } else {
      analysis.summary = analysisResult.summary;
      analysis.emotion = analysisResult.emotion;
      analysis.keywords = analysisResult.keywords;
      analysis.suggestedCategory = analysisResult.suggestedCategory;
      analysis.peopleMentioned = analysisResult.peopleMentioned;
      analysis.eventsMentioned = analysisResult.eventsMentioned;
    }

    const savedAnalysis = await this.aiAnalysisRepository.save(analysis);

    // Generate & store vector embedding for semantic search (Phase 11)
    await this.generateAndStoreEmbedding(memory);

    return savedAnalysis;
  }

  // 2. Generate and store embedding vector
  async generateAndStoreEmbedding(memory: Memory): Promise<MemoryEmbedding> {
    const textToEmbed = `${memory.title}\n${memory.content}\nMood: ${memory.mood}`;
    const embedding = await this.embeddingProvider.generateEmbedding(textToEmbed);

    let memEmbedding = await this.embeddingRepository.findOne({
      where: { memoryId: memory.id },
    });

    if (!memEmbedding) {
      memEmbedding = this.embeddingRepository.create({
        memoryId: memory.id,
        embeddingData: JSON.stringify(embedding),
        modelName: this.embeddingProvider.getModelName(),
        dimensions: this.embeddingProvider.getDimensions(),
      });
    } else {
      memEmbedding.embeddingData = JSON.stringify(embedding);
      memEmbedding.modelName = this.embeddingProvider.getModelName();
      memEmbedding.dimensions = this.embeddingProvider.getDimensions();
    }

    return this.embeddingRepository.save(memEmbedding);
  }

  // 3. Ask My Diary (RAG Pipeline)
  async askMyDiary(userId: string, question: string) {
    // 1. Fetch user memories
    const userMemories = await this.memoryRepository.find({
      where: { userId },
      order: { memoryDate: 'DESC' },
      take: 20,
    });

    if (userMemories.length === 0) {
      return {
        answer: "Your diary is currently empty. Start writing some memories first!",
        sources: [],
      };
    }

    // 2. Calculate top-k relevant memories using semantic similarity or keyword scoring
    const scored = userMemories.map((m) => {
      const qTerms = question.toLowerCase().split(/\s+/);
      const text = `${m.title} ${m.content} ${m.mood} ${m.locationName || ''}`.toLowerCase();
      let score = 0;
      qTerms.forEach((term) => {
        if (term.length > 2 && text.includes(term)) score += 1;
      });
      return { memory: m, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMemories = scored.slice(0, 5).map((s) => s.memory);

    // 3. LLM generation with retrieved memories
    const result = await this.llmProvider.answerQuestion(question, topMemories);

    // 4. Return answer + source memory cards
    const sourceCards = topMemories.filter((m) =>
      result.sourceMemoryIds.includes(m.id),
    );

    return {
      question,
      answer: result.answer,
      sources: sourceCards.length > 0 ? sourceCards : topMemories.slice(0, 2),
    };
  }

  // 4. Personal Insights & Stats
  async getPersonalInsights(userId: string) {
    const memories = await this.memoryRepository.find({
      where: { userId },
      relations: { category: true },
      order: { memoryDate: 'DESC' },
    });

    const total = memories.length;

    // Mood breakdown
    const moodDistribution: Record<string, number> = {};
    // Category breakdown
    const categoryDistribution: Record<string, number> = {};
    // Visited locations
    const locationCounts: Record<string, number> = {};

    memories.forEach((m) => {
      moodDistribution[m.mood] = (moodDistribution[m.mood] || 0) + 1;
      const catName = m.category?.name || 'Uncategorized';
      categoryDistribution[catName] = (categoryDistribution[catName] || 0) + 1;
      if (m.locationName) {
        locationCounts[m.locationName] = (locationCounts[m.locationName] || 0) + 1;
      }
    });

    const summaries = memories.map((m) => ({
      title: m.title,
      mood: m.mood,
      category: m.category?.name,
      date: m.memoryDate,
    }));

    const aiInsights = await this.mockProvider.generatePersonalInsights(summaries);

    return {
      totalMemories: total,
      moodDistribution,
      categoryDistribution,
      topLocations: Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      aiInsights,
    };
  }
}
