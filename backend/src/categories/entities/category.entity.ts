import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Memory } from '../../memories/entities/memory.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 50, nullable: true })
  icon?: string;

  @Column({ length: 30, nullable: true })
  color?: string;

  @OneToMany(() => Memory, (memory) => memory.category)
  memories: Memory[];

  @CreateDateColumn()
  createdAt: Date;
}
