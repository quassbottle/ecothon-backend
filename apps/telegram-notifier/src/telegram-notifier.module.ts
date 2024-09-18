import { Module } from '@nestjs/common';
import { TelegramNotifierController } from './telegram-notifier.controller';
import { TelegramNotifierService } from './telegram-notifier.service';
import { RateLimiterModule } from 'libs/rate-limiter/src';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    RateLimiterModule.forRoot({ requestsPerSecond: 30 }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          token: config.get<string>('TELEGRAM_BOT_TOKEN'),
          usePollUpdates: true,
        };
      },
    }),
  ],
  controllers: [TelegramNotifierController],
  providers: [TelegramNotifierService],
})
export class TelegramNotifierModule {}
