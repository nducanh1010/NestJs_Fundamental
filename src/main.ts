import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public')); // cho phép truy cập thư mục css, js, images
  app.setBaseViewsDir(join(__dirname, '..', 'views'));  // nơi store html
  app.setViewEngine('ejs');
  await app.listen(3000);
}
bootstrap();
