import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('memory_embeddings')
export class MemoryEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', unique: true })
  memoryId: string;

  @OneToOne(() => Memory, (memory) => memory.embedding, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memoryId' })
  memory: Memory;

  @Column({ type: 'text' })
  embeddingData: string;

  @Column({ length: 100, default: 'text-embedding-3-small' })
  modelName: string;

  @Column({ type: 'int', default: 1536 })
  dimensions: number;

  @CreateDateColumn()
  createdAt: Date;
}
