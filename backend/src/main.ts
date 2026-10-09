import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const prefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(prefix);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // 1. Serve uploaded images statically
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // 2. Serve built React frontend statically on the same unified port
  const candidateFrontendPaths = [
    join(process.cwd(), '..', 'frontend', 'dist'),
    join(process.cwd(), 'frontend', 'dist'),
    join(__dirname, '..', '..', 'frontend', 'dist'),
  ];
  const frontendPath = candidateFrontendPaths.find((p) => existsSync(p));

  if (frontendPath) {
    logger.log(`Serving unified frontend from: ${frontendPath}`);
    app.useStaticAssets(frontendPath);

    // Fallback to index.html for SPA routes (excluding API and uploads)
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('*', (req: any, res: any, next: any) => {
      if (req.path.startsWith(`/${prefix}`) || req.path.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(join(frontendPath, 'index.html'));
    });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`=======================================================`);
  logger.log(`🎉 MemoAI Unified App running on: http://localhost:${port}`);
  logger.log(`👉 Web Application: http://localhost:${port}`);
  logger.log(`👉 REST API:        http://localhost:${port}/${prefix}`);
  logger.log(`=======================================================`);
}
bootstrap();
