import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memory } from './entities/memory.entity';
import { MemoryImage } from './entities/memory-image.entity';
import { TagsService } from '../tags/tags.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { QueryMemoryDto } from './dto/query-memory.dto';

@Injectable()
export class MemoriesService {
  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
    @InjectRepository(MemoryImage)
    private readonly imageRepository: Repository<MemoryImage>,
    private readonly tagsService: TagsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(userId: string, dto: CreateMemoryDto): Promise<Memory> {
    // Process tags
    const tags = [];
    if (dto.tags && dto.tags.length > 0) {
      for (const tagName of dto.tags) {
        if (tagName.trim()) {
          const tag = await this.tagsService.findOrCreate(tagName);
          tags.push(tag);
        }
      }
    }

    // Verify category if provided
    let category = null;
    if (dto.categoryId) {
      category = await this.categoriesService.findOne(dto.categoryId);
    }

    // Create memory
    const memory = this.memoryRepository.create({
      userId,
      title: dto.title,
      content: dto.content,
      memoryDate: dto.memoryDate,
      mood: dto.mood || 'Neutral',
      categoryId: category ? category.id : null,
      locationName: dto.locationName || null,
      latitude: dto.latitude || null,
      longitude: dto.longitude || null,
      tags,
    });

    const savedMemory = await this.memoryRepository.save(memory);

    // Save images if provided
    if (dto.imageUrls && dto.imageUrls.length > 0) {
      for (const url of dto.imageUrls) {
        if (url.trim()) {
          await this.imageRepository.save(
            this.imageRepository.create({
              memoryId: savedMemory.id,
              imageUrl: url.trim(),
            }),
          );
        }
      }
    }

    return this.findOne(userId, savedMemory.id);
  }

  async findAll(userId: string, query: QueryMemoryDto = {}): Promise<Memory[]> {
    const qb = this.memoryRepository
      .createQueryBuilder('memory')
      .leftJoinAndSelect('memory.category', 'category')
      .leftJoinAndSelect('memory.tags', 'tags')
      .leftJoinAndSelect('memory.images', 'images')
      .leftJoinAndSelect('memory.aiAnalysis', 'aiAnalysis')
      .where('memory.userId = :userId', { userId });

    if (query.categoryId) {
      qb.andWhere('memory.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query.mood) {
      qb.andWhere('memory.mood = :mood', { mood: query.mood });
    }

    if (query.tag) {
      qb.andWhere('tags.name = :tag', { tag: query.tag.toLowerCase().trim() });
    }

    if (query.startDate && query.endDate) {
      qb.andWhere('memory.memoryDate BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    } else if (query.startDate) {
      qb.andWhere('memory.memoryDate >= :startDate', { startDate: query.startDate });
    } else if (query.endDate) {
      qb.andWhere('memory.memoryDate <= :endDate', { endDate: query.endDate });
    }

    if (query.search) {
      const term = `%${query.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(memory.title) LIKE :term OR LOWER(memory.content) LIKE :term OR LOWER(memory.locationName) LIKE :term)',
        { term },
      );
    }

    qb.orderBy('memory.memoryDate', 'DESC').addOrderBy('memory.createdAt', 'DESC');

    return qb.getMany();
  }

  async findOne(userId: string, id: string): Promise<Memory> {
    const memory = await this.memoryRepository.findOne({
      where: { id },
      relations: {
        category: true,
        tags: true,
        images: true,
        aiAnalysis: true,
      },
    });

    if (!memory) {
      throw new NotFoundException(`Memory #${id} not found`);
    }

    // Strict ownership verification
    if (memory.userId !== userId) {
      throw new NotFoundException(`Memory #${id} not found`); // 404 for privacy
    }

    return memory;
  }

  async update(userId: string, id: string, dto: UpdateMemoryDto): Promise<Memory> {
    const memory = await this.findOne(userId, id);

    if (dto.title !== undefined) memory.title = dto.title;
    if (dto.content !== undefined) memory.content = dto.content;
    if (dto.memoryDate !== undefined) memory.memoryDate = dto.memoryDate;
    if (dto.mood !== undefined) memory.mood = dto.mood;
    if (dto.locationName !== undefined) memory.locationName = dto.locationName;
    if (dto.latitude !== undefined) memory.latitude = dto.latitude;
    if (dto.longitude !== undefined) memory.longitude = dto.longitude;

    if (dto.categoryId !== undefined) {
      memory.categoryId = dto.categoryId || null;
    }

    if (dto.tags !== undefined) {
      const newTags = [];
      for (const tagName of dto.tags) {
        if (tagName.trim()) {
          const tag = await this.tagsService.findOrCreate(tagName);
          newTags.push(tag);
        }
      }
      memory.tags = newTags;
    }

    if (dto.imageUrls !== undefined) {
      await this.imageRepository.delete({ memoryId: id });
      for (const url of dto.imageUrls) {
        if (url.trim()) {
          await this.imageRepository.save(
            this.imageRepository.create({
              memoryId: id,
              imageUrl: url.trim(),
            }),
          );
        }
      }
    }

    await this.memoryRepository.save(memory);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string): Promise<{ deleted: boolean; id: string }> {
    const memory = await this.findOne(userId, id);
    await this.memoryRepository.remove(memory);
    return { deleted: true, id };
  }
}
