import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Memory } from '../memories/entities/memory.entity';
import { MemoryImage } from '../memories/entities/memory-image.entity';
import { AiAnalysis } from '../ai/entities/ai-analysis.entity';
import { MemoryEmbedding } from '../ai/entities/memory-embedding.entity';
import { DatabaseSeedService } from './seed.service';

const ALL_ENTITIES = [
  User,
  Category,
  Tag,
  Memory,
  MemoryImage,
  AiAnalysis,
  MemoryEmbedding,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const dbType = config.get<string>('DB_TYPE', 'sqlite');

        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: config.get<string>('DB_HOST', 'localhost'),
            port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
            username: config.get<string>('DB_USER', 'postgres'),
            password: config.get<string>('DB_PASSWORD', 'postgres'),
            database: config.get<string>('DB_NAME', 'memoai'),
            entities: ALL_ENTITIES,
            synchronize: true,
            logging: false,
          } as unknown as TypeOrmModuleOptions;
        }

        return {
          type: 'sqlite',
          database: config.get<string>('DB_SQLITE_PATH', 'storage/memoai.sqlite'),
          entities: ALL_ENTITIES,
          synchronize: true,
          logging: false,
        } as unknown as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  providers: [DatabaseSeedService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
