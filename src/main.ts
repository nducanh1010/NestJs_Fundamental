import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useStaticAssets(join(__dirname, '..', 'public')); // cho phép truy cập thư mục css, js, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // nơi store html
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe(
      { whitelist: true }, // update khoong bij maats duwx lieeuj
    ),
  );
  // config cookies
  app.use(cookieParser());
  // config CORS
  app.enableCors({
    origin: true, // cho phép nơi nào có thể kết nối tới
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  // config versioning api  ( cho phép quản lý, thêm đuôi v1, v2 ... cho đối tượng khác nhau)
  app.setGlobalPrefix('api'); // config tiền tố trước link api
  app.enableVersioning({
    type: VersioningType.URI,
    // prefix:'api/v', // config tiền tố trước link api
    defaultVersion: ['1', '2'],
  });
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    }),
  );
  //config swagger
  const config = new DocumentBuilder() // tài liệu api
    .setTitle('NestJs API Document')
    .setDescription('All API Module')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
