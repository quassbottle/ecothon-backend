import { NestFactory } from '@nestjs/core';
import { EmailNotifierModule } from './email-notifier.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailNotifierModule);
  await app.listen(3000);
}
bootstrap();
