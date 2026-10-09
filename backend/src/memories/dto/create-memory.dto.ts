import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { MemoryMood } from '../entities/memory.entity';

export class CreateMemoryDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;

  @IsNotEmpty({ message: 'Memory date is required' })
  @IsDateString({}, { message: 'Date must be a valid ISO format (YYYY-MM-DD)' })
  memoryDate: string;

  @IsOptional()
  @IsString()
  mood?: string = MemoryMood.NEUTRAL;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  locationName?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsString()
  entryType?: string;

  @IsOptional()
  @IsString()
  reflectionAnswers?: string;
}
