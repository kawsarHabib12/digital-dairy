export interface DiaryAnalysisResult {
  summary: string;
  emotion: string;
  keywords: string[];
  suggestedCategory?: string;
  peopleMentioned?: string[];
  eventsMentioned?: string[];
}

export interface ILlmProvider {
  analyzeDiaryEntry(title: string, content: string): Promise<DiaryAnalysisResult>;
  answerQuestion(
    question: string,
    contextMemories: { id: string; title: string; content: string; memoryDate: string; mood?: string }[],
  ): Promise<{ answer: string; sourceMemoryIds: string[] }>;
  generatePersonalInsights?(
    memoriesSummary: { title: string; mood: string; category?: string; date: string }[],
  ): Promise<string[]>;
}
