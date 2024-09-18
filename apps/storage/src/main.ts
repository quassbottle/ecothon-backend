import { NestFactory } from '@nestjs/core';
import { StorageModule } from './storage.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(StorageModule);

  // Enable CORS for all routes
  app.enableCors({
    origin: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders:
      'X-Requested-With, Origin, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
  });

  // Swagger Configuration
  const config = new DocumentBuilder().setTitle('Ecothon S3 Provider').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3333);
}
bootstrap();
