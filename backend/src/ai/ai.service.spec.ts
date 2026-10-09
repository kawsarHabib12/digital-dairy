import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { AiAnalysis } from './entities/ai-analysis.entity';
import { MemoryEmbedding } from './entities/memory-embedding.entity';
import { Memory } from '../memories/entities/memory.entity';
import { ConfigService } from '@nestjs/config';
import { GeminiProvider } from './providers/gemini.provider';
import { MockAiProvider } from './providers/mock.provider';

const getRepoToken = (entity: any) => `${entity.name}Repository`;

describe('AiService', () => {
  let service: AiService;
  let aiAnalysisRepo: any;
  let embeddingRepo: any;
  let memoryRepo: any;
  let mockAiProvider: any;

  beforeEach(async () => {
    aiAnalysisRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((a) => Promise.resolve({ id: 'analysis-1', ...a })),
    };

    embeddingRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((e) => Promise.resolve({ id: 'embed-1', ...e })),
    };

    memoryRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
    };

    mockAiProvider = new MockAiProvider();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: getRepoToken(AiAnalysis), useValue: aiAnalysisRepo },
        { provide: getRepoToken(MemoryEmbedding), useValue: embeddingRepo },
        { provide: getRepoToken(Memory), useValue: memoryRepo },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock'),
          },
        },
        { provide: GeminiProvider, useValue: {} },
        { provide: MockAiProvider, useValue: mockAiProvider },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should analyze memory and persist analysis', async () => {
    memoryRepo.findOne.mockResolvedValue({
      id: 'mem-1',
      title: 'Visiting Coxs Bazar',
      content: 'We walked along the longest natural beach in the world with family.',
      mood: 'Happy',
    });

    aiAnalysisRepo.findOne.mockResolvedValue(null);

    const analysis = await service.analyzeMemory('user-1', 'mem-1');
    expect(analysis).toBeDefined();
    expect(analysis.summary).toBeDefined();
    expect(analysis.emotion).toBeDefined();
    expect(aiAnalysisRepo.save).toHaveBeenCalled();
  });

  it('should answer questions strictly using personal memories in Ask My Diary', async () => {
    memoryRepo.find.mockResolvedValue([
      {
        id: 'mem-1',
        title: 'Graduation Ceremony',
        content: 'I celebrated graduating with honors alongside my professors and parents.',
        memoryDate: '2026-06-15',
        mood: 'Proud',
      },
    ]);

    const result = await service.askMyDiary('user-1', 'When did I graduate?');
    expect(result).toHaveProperty('answer');
    expect(result).toHaveProperty('sources');
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.sources[0].title).toBe('Graduation Ceremony');
  });
});
