import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ai/analyze/:memoryId')
  @HttpCode(HttpStatus.OK)
  async analyzeMemory(
    @CurrentUser() user: User,
    @Param('memoryId') memoryId: string,
  ) {
    return this.aiService.analyzeMemory(user.id, memoryId);
  }

  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async askMyDiary(
    @CurrentUser() user: User,
    @Body('question') question: string,
  ) {
    return this.aiService.askMyDiary(user.id, question || '');
  }

  @Get('insights')
  async getInsights(@CurrentUser() user: User) {
    return this.aiService.getPersonalInsights(user.id);
  }
}
