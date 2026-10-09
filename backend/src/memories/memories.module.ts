import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memory } from './entities/memory.entity';
import { MemoryImage } from './entities/memory-image.entity';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { TagsModule } from '../tags/tags.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Memory, MemoryImage]),
    TagsModule,
    CategoriesModule,
  ],
  controllers: [MemoriesController],
  providers: [MemoriesService],
  exports: [MemoriesService],
})
export class MemoriesModule {}
