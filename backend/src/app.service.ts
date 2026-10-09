import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'MemoAI REST API',
      version: '1.0.0',
      description: 'AI-Powered Digital Diary Backend Service',
      tagline: 'Your memories. Your story. One intelligent diary.',
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'MemoAI API',
      phase: 1,
    };
  }
}
