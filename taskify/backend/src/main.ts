import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', 
    credentials: true,
  });
  await app.listen(3001); // Backend runs on port 3001
}
bootstrap();
