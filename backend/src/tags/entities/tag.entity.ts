import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 100 })
  name: string;

  @ManyToMany(() => Memory, (memory) => memory.tags)
  memories: Memory[];

  @CreateDateColumn()
  createdAt: Date;
}
