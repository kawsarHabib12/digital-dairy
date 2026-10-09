import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Memory } from './memory.entity';

@Entity('memory_images')
export class MemoryImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  memoryId: string;

  @ManyToOne(() => Memory, (memory) => memory.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memoryId' })
  memory: Memory;

  @Column({ type: 'text' })
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
