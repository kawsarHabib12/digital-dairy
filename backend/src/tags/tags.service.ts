import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ order: { name: 'ASC' } });
  }

  async findOrCreate(name: string): Promise<Tag> {
    const trimmed = name.trim().toLowerCase();
    let tag = await this.tagRepository.findOne({ where: { name: trimmed } });
    if (!tag) {
      tag = await this.tagRepository.save(this.tagRepository.create({ name: trimmed }));
    }
    return tag;
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const trimmed = dto.name.trim().toLowerCase();
    const existing = await this.tagRepository.findOne({ where: { name: trimmed } });
    if (existing) {
      throw new ConflictException(`Tag "${trimmed}" already exists`);
    }
    return this.tagRepository.save(this.tagRepository.create({ name: trimmed }));
  }
}
