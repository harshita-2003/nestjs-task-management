import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { CustomLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3001",
    credentials: true, 
  });

  //custom logger
  const customLogger = app.get(CustomLoggerService);
  app.useLogger(customLogger);
  
  // Enable global validation pipe
  // This will automatically validate incoming requests based on the DTOs defined
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())

  const port = 3000;
  await app.listen(port);
  customLogger.log(`⚙️ Application listening on port ${port}`);
}
bootstrap();
