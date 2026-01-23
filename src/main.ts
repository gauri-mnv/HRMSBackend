import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


const url = 'http://localhost:8006';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());

  
  await app.listen(process.env.PORT ?? 8002);
  console.log(`Application is running on: ${url}`);
}
bootstrap();


 