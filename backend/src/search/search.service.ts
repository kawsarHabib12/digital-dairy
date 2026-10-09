import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memory } from '../memories/entities/memory.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Memory)
    private readonly memoryRepository: Repository<Memory>,
  ) {}

  async search(userId: string, query: string = ''): Promise<Memory[]> {
    const term = `%${query.toLowerCase().trim()}%`;

    const qb = this.memoryRepository
      .createQueryBuilder('memory')
      .leftJoinAndSelect('memory.category', 'category')
      .leftJoinAndSelect('memory.tags', 'tags')
      .leftJoinAndSelect('memory.images', 'images')
      .leftJoinAndSelect('memory.aiAnalysis', 'aiAnalysis')
      .where('memory.userId = :userId', { userId });

    if (query.trim()) {
      qb.andWhere(
        '(LOWER(memory.title) LIKE :term OR LOWER(memory.content) LIKE :term OR LOWER(memory.locationName) LIKE :term OR LOWER(category.name) LIKE :term OR LOWER(tags.name) LIKE :term)',
        { term },
      );
    }

    qb.orderBy('memory.memoryDate', 'DESC');
    return qb.getMany();
  }
}
