/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4200','https://tigershare.vercel.app','https://web.facebook.com','https://www.facebook.com'],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
  });
  await app.listen(3000);
}
bootstrap();
