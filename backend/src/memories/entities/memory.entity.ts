import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { MemoryImage } from './memory-image.entity';
import { AiAnalysis } from '../../ai/entities/ai-analysis.entity';
import { MemoryEmbedding } from '../../ai/entities/memory-embedding.entity';

export enum MemoryMood {
  HAPPY = 'Happy',
  SAD = 'Sad',
  EXCITED = 'Excited',
  CALM = 'Calm',
  ANGRY = 'Angry',
  NOSTALGIC = 'Nostalgic',
  GRATEFUL = 'Grateful',
  NEUTRAL = 'Neutral',
}

@Entity('memories')
export class Memory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.memories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Index()
  @Column({ type: 'date' })
  memoryDate: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: MemoryMood.NEUTRAL,
  })
  mood: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;

  @ManyToOne(() => Category, (category) => category.memories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ length: 255, nullable: true })
  locationName?: string;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  @ManyToMany(() => Tag, (tag) => tag.memories, { cascade: true })
  @JoinTable({
    name: 'memory_tags',
    joinColumn: { name: 'memoryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(() => MemoryImage, (image) => image.memory, { cascade: true })
  images: MemoryImage[];

  @OneToOne(() => AiAnalysis, (analysis) => analysis.memory, { cascade: true })
  aiAnalysis?: AiAnalysis;

  @OneToOne(() => MemoryEmbedding, (embedding) => embedding.memory, {
    cascade: true,
  })
  embedding?: MemoryEmbedding;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
