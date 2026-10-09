import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { QueryMemoryDto } from './dto/query-memory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createMemoryDto: CreateMemoryDto,
  ) {
    return this.memoriesService.create(user.id, createMemoryDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() query: QueryMemoryDto,
  ) {
    return this.memoriesService.findAll(user.id, query);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.memoriesService.findOne(user.id, id);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
  ) {
    return this.memoriesService.update(user.id, id, updateMemoryDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.memoriesService.remove(user.id, id);
  }
}
