import { NestFactory } from '@nestjs/core';
import { TelegramNotifierModule } from './telegram-notifier.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TelegramNotifierModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_ENDPOINT],
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
