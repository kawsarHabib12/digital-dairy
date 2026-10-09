import { Test, TestingModule } from '@nestjs/testing';
import { MemoriesService } from './memories.service';
import { Memory } from './entities/memory.entity';
import { MemoryImage } from './entities/memory-image.entity';
import { TagsService } from '../tags/tags.service';
import { CategoriesService } from '../categories/categories.service';
import { NotFoundException } from '@nestjs/common';

const getRepoToken = (entity: any) => `${entity.name}Repository`;

describe('MemoriesService', () => {
  let service: MemoriesService;
  let memoryRepo: any;
  let imageRepo: any;
  let tagsService: any;
  let categoriesService: any;

  beforeEach(async () => {
    memoryRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((mem) => Promise.resolve({ id: 'mem-1', ...mem })),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      remove: jest.fn(),
    };

    imageRepo = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue([]),
    };

    tagsService = {
      findOrCreate: jest.fn().mockImplementation((name) => Promise.resolve({ id: 't-1', name })),
    };

    categoriesService = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoriesService,
        { provide: getRepoToken(Memory), useValue: memoryRepo },
        { provide: getRepoToken(MemoryImage), useValue: imageRepo },
        { provide: TagsService, useValue: tagsService },
        { provide: CategoriesService, useValue: categoriesService },
      ],
    }).compile();

    service = module.get<MemoriesService>(MemoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a memory if owned by the user', async () => {
      const mockMemory = { id: 'mem-1', userId: 'user-1', title: 'Day in Paris' };
      memoryRepo.findOne.mockResolvedValue(mockMemory);

      const result = await service.findOne('user-1', 'mem-1');
      expect(result).toEqual(mockMemory);
      expect(memoryRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'mem-1' },
        relations: {
          category: true,
          tags: true,
          images: true,
          aiAnalysis: true,
        },
      });
    });

    it('should throw NotFoundException if memory belongs to another user (User isolation)', async () => {
      const mockMemory = { id: 'mem-1', userId: 'user-1', title: 'Day in Paris' };
      memoryRepo.findOne.mockResolvedValue(mockMemory);

      await expect(service.findOne('user-2', 'mem-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete memory when user owns it', async () => {
      const mockMemory = { id: 'mem-1', userId: 'user-1' };
      memoryRepo.findOne.mockResolvedValue(mockMemory);
      memoryRepo.remove.mockResolvedValue(mockMemory);

      const result = await service.remove('user-1', 'mem-1');
      expect(result).toEqual({ deleted: true, id: 'mem-1' });
      expect(memoryRepo.remove).toHaveBeenCalledWith(mockMemory);
    });

    it('should throw NotFoundException on delete if not owned by user', async () => {
      const mockMemory = { id: 'mem-1', userId: 'user-1' };
      memoryRepo.findOne.mockResolvedValue(mockMemory);

      await expect(service.remove('user-stranger', 'mem-1')).rejects.toThrow(NotFoundException);
    });
  });
});
