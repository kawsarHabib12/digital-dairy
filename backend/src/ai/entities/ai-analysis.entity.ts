import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('ai_analysis')
export class AiAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid', unique: true })
  memoryId: string;

  @OneToOne(() => Memory, (memory) => memory.aiAnalysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memoryId' })
  memory: Memory;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ length: 50, nullable: true })
  emotion: string;

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ length: 100, nullable: true })
  suggestedCategory?: string;

  @Column('simple-array', { nullable: true })
  peopleMentioned?: string[];

  @Column('simple-array', { nullable: true })
  eventsMentioned?: string[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
