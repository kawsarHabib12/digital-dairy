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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `memory-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files (JPG, PNG, GIF, WEBP) are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    const serverUrl = process.env.BASE_URL || 'http://localhost:3001';
    return {
      imageUrl: `${serverUrl}/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

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
