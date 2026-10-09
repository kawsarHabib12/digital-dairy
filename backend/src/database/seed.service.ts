import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { INITIAL_CATEGORIES, INITIAL_TAGS } from './seeds/category.seed';

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCategories();
    await this.seedTags();
  }

  private async seedCategories() {
    try {
      const count = await this.categoryRepository.count();
      if (count === 0) {
        this.logger.log('Seeding initial categories...');
        for (const cat of INITIAL_CATEGORIES) {
          const exists = await this.categoryRepository.findOne({ where: { name: cat.name } });
          if (!exists) {
            await this.categoryRepository.save(this.categoryRepository.create(cat));
          }
        }
        this.logger.log(`Seeded ${INITIAL_CATEGORIES.length} categories.`);
      }
    } catch (err) {
      this.logger.warn(`Category seeding skipped or encountered note: ${err.message}`);
    }
  }

  private async seedTags() {
    try {
      const count = await this.tagRepository.count();
      if (count === 0) {
        this.logger.log('Seeding initial tags...');
        for (const tagName of INITIAL_TAGS) {
          const exists = await this.tagRepository.findOne({ where: { name: tagName } });
          if (!exists) {
            await this.tagRepository.save(this.tagRepository.create({ name: tagName }));
          }
        }
        this.logger.log(`Seeded ${INITIAL_TAGS.length} tags.`);
      }
    } catch (err) {
      this.logger.warn(`Tag seeding skipped or encountered note: ${err.message}`);
    }
  }
}
