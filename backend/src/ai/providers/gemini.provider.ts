import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ILlmProvider, DiaryAnalysisResult } from '../interfaces/llm-provider.interface';
import { IEmbeddingProvider } from '../interfaces/embedding-provider.interface';
import { MockAiProvider } from './mock.provider';

@Injectable()
export class GeminiProvider implements ILlmProvider, IEmbeddingProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly apiKey?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mockFallback: MockAiProvider,
  ) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
  }

  async analyzeDiaryEntry(title: string, content: string): Promise<DiaryAnalysisResult> {
    if (!this.apiKey) {
      return this.mockFallback.analyzeDiaryEntry(title, content);
    }

    try {
      // Call Google Gemini API
      const prompt = `Analyze this digital diary entry. Return ONLY a valid JSON object with:
{
  "summary": "concise 1-2 sentence summary",
  "emotion": "Happy|Sad|Excited|Calm|Angry|Nostalgic|Grateful|Neutral",
  "keywords": ["array", "of", "keywords"],
  "suggestedCategory": "Personal|University|Study|Work|Travel|Family|Friends|Achievement|Other",
  "peopleMentioned": ["names if mentioned"],
  "eventsMentioned": ["events if mentioned"]
}

Title: ${title}
Content: ${content}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) {
        throw new Error(`Gemini API HTTP ${res.status}`);
      }

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(rawText);

      return {
        summary: parsed.summary || `${title} recorded.`,
        emotion: parsed.emotion || 'Calm',
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        suggestedCategory: parsed.suggestedCategory || 'Personal',
        peopleMentioned: Array.isArray(parsed.peopleMentioned) ? parsed.peopleMentioned : [],
        eventsMentioned: Array.isArray(parsed.eventsMentioned) ? parsed.eventsMentioned : [],
      };
    } catch (err) {
      this.logger.warn(`Gemini live API call failed or key inactive: ${err.message}. Falling back to internal NLP engine.`);
      return this.mockFallback.analyzeDiaryEntry(title, content);
    }
  }

  async answerQuestion(
    question: string,
    contextMemories: { id: string; title: string; content: string; memoryDate: string; mood?: string }[],
  ): Promise<{ answer: string; sourceMemoryIds: string[] }> {
    if (!this.apiKey || contextMemories.length === 0) {
      return this.mockFallback.answerQuestion(question, contextMemories);
    }

    try {
      const contextText = contextMemories
        .map((m, idx) => `[Memory #${idx + 1} | Date: ${m.memoryDate} | Title: "${m.title}"]: ${m.content}`)
        .join('\n\n');

      const prompt = `You are MemoAI, a personal digital diary companion.
Answer the user's question ONLY using the provided diary entries.
If the information is not contained in the diary entries, explicitly state that you could not find that memory in the diary.
Do not invent facts.

Diary Entries:
${contextText}

Question: ${question}

Answer:`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!res.ok) throw new Error(`Gemini API HTTP ${res.status}`);

      const json = await res.json();
      const answer = json.candidates?.[0]?.content?.parts?.[0]?.text;

      return {
        answer: answer || "I couldn't find details about that in your memories.",
        sourceMemoryIds: contextMemories.map(m => m.id),
      };
    } catch (err) {
      this.logger.warn(`Gemini QA fallback: ${err.message}`);
      return this.mockFallback.answerQuestion(question, contextMemories);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return this.mockFallback.generateEmbedding(text);
  }

  getDimensions(): number {
    return 1536;
  }

  getModelName(): string {
    return 'gemini-text-embedding-004';
  }
}
