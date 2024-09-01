import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
// import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  app.use('/storage', express.static(join(__dirname, '..', 'storage')));
  // Usando interceptor de forma global , para monitorar a aplicação, erros , o que esta sendo mais acessado
  // app.useGlobalInterceptors(new LogInterceptor())

  await app.listen(3000);
}
bootstrap();
