import { Injectable, Logger } from '@nestjs/common';
import { ILlmProvider, DiaryAnalysisResult } from '../interfaces/llm-provider.interface';
import { IEmbeddingProvider } from '../interfaces/embedding-provider.interface';

@Injectable()
export class MockAiProvider implements ILlmProvider, IEmbeddingProvider {
  private readonly logger = new Logger(MockAiProvider.name);

  // 1. Diary Analysis
  async analyzeDiaryEntry(title: string, content: string): Promise<DiaryAnalysisResult> {
    const text = `${title} ${content}`.toLowerCase();

    // Emotion detection heuristics
    let emotion = 'Calm';
    if (text.match(/happy|joy|great|wonderful|sunset|beach|awesome|proud|loved/)) emotion = 'Happy';
    else if (text.match(/excited|fun|thrill|can't wait|party|trip|adventure/)) emotion = 'Excited';
    else if (text.match(/sad|miss|crying|upset|failed|lost|lonely/)) emotion = 'Sad';
    else if (text.match(/grateful|thankful|blessed|appreciate/)) emotion = 'Grateful';
    else if (text.match(/remember|old times|nostalgia|past|years ago/)) emotion = 'Nostalgic';
    else if (text.match(/angry|mad|furious|annoyed|terrible/)) emotion = 'Angry';

    // Category suggestion heuristics
    let suggestedCategory = 'Personal';
    if (text.match(/beach|flight|travel|hotel|trip|visit|tour|cox's bazar/)) suggestedCategory = 'Travel';
    else if (text.match(/university|faculty|exam|lecture|professor|assignment|class/)) suggestedCategory = 'University';
    else if (text.match(/study|homework|reading|library|notes|exam/)) suggestedCategory = 'Study';
    else if (text.match(/office|boss|work|meeting|project|job|client/)) suggestedCategory = 'Work';
    else if (text.match(/family|mom|dad|brother|sister|parents|home/)) suggestedCategory = 'Family';
    else if (text.match(/friends|friend|buddy|party|hangout|dinner/)) suggestedCategory = 'Friends';
    else if (text.match(/won|award|accomplish|passed|graduated|presentation/)) suggestedCategory = 'Achievement';

    // Extract significant keywords
    const words = `${title} ${content}`.replace(/[^\w\s]/gi, '').split(/\s+/);
    const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'was', 'were', 'have', 'from', 'today', 'went', 'spent', 'about', 'some', 'what', 'there', 'very']);
    const keywordsSet = new Set<string>();

    for (const w of words) {
      if (w.length > 3 && !stopWords.has(w.toLowerCase()) && keywordsSet.size < 6) {
        keywordsSet.add(w.charAt(0).toUpperCase() + w.slice(1));
      }
    }

    // Extractive summary
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summary = sentences.length > 0
      ? `${title}: ${sentences[0].trim()}.`
      : `${title} recorded.`;

    return {
      summary,
      emotion,
      keywords: Array.from(keywordsSet),
      suggestedCategory,
      peopleMentioned: text.includes('friend') ? ['Friends'] : text.includes('family') ? ['Family'] : [],
      eventsMentioned: [title],
    };
  }

  // 2. RAG QA Answering (Answer strictly grounded in retrieved memories)
  async answerQuestion(
    question: string,
    contextMemories: { id: string; title: string; content: string; memoryDate: string; mood?: string }[],
  ): Promise<{ answer: string; sourceMemoryIds: string[] }> {
    if (!contextMemories || contextMemories.length === 0) {
      return {
        answer: "I couldn't find any relevant memories in your diary entries to answer that question.",
        sourceMemoryIds: [],
      };
    }

    const q = question.toLowerCase();
    const sourceIds: string[] = [];

    // Check relevant memories
    const relevant = contextMemories.filter(m => {
      const match = m.title.toLowerCase().includes(q) || 
                    m.content.toLowerCase().includes(q) ||
                    (q.includes('happy') && m.mood === 'Happy') ||
                    (q.includes('travel') && m.content.toLowerCase().includes('beach'));
      return match || contextMemories.length <= 3;
    });

    const chosen = relevant.length > 0 ? relevant.slice(0, 3) : contextMemories.slice(0, 2);
    chosen.forEach(c => sourceIds.push(c.id));

    const bullets = chosen.map(m => `• On ${m.memoryDate}, in "${m.title}", you wrote: "${m.content.slice(0, 150)}..."`).join('\n\n');

    const answer = `Based on your diary memories:\n\n${bullets}`;

    return {
      answer,
      sourceMemoryIds: sourceIds,
    };
  }

  // 3. AI Personal Insights
  async generatePersonalInsights(
    memories: { title: string; mood: string; category?: string; date: string }[],
  ): Promise<string[]> {
    if (!memories || memories.length === 0) {
      return ['Start writing more entries to unlock personalized reflection trends.'];
    }

    const insights: string[] = [];
    const happyCount = memories.filter(m => m.mood === 'Happy' || m.mood === 'Excited').length;

    if (happyCount > memories.length / 2) {
      insights.push('You maintained an overwhelmingly positive emotional state across the majority of your journal entries.');
    } else {
      insights.push('Your reflections show thoughtful emotional balance and steady day-to-day mindfulness.');
    }

    insights.push(`You have created ${memories.length} entries, building a consistent habit of capturing your life story.`);
    return insights;
  }

  // 4. Embedding vector generation (1536 dimensions)
  async generateEmbedding(text: string): Promise<number[]> {
    const dim = 1536;
    const vector = new Array(dim).fill(0);
    // Deterministic pseudo-embedding based on character n-grams and hashing
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
      const idx = Math.abs((hash + i * 31) % dim);
      vector[idx] += 1 / (1 + (i % 5));
    }
    // Normalize to unit vector
    let norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map(v => parseFloat((v / norm).toFixed(6)));
  }

  getDimensions(): number {
    return 1536;
  }

  getModelName(): string {
    return 'mock-nlp-embedding-v1';
  }
}
