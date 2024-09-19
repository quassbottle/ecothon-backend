import { Module } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramAuthController } from './telegram-auth.controller';
import { UserModule } from '../user/user.module';
import { init } from '@paralleldrive/cuid2';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          token: config.get<string>('TELEGRAM_BOT_TOKEN'),
        };
      },
    }),
  ],
  providers: [
    TelegramAuthService,
    {
      provide: 'EVENT_ID',
      useValue: init({ length: 16 }),
    },
  ],
  controllers: [TelegramAuthController],
})
export class TelegramAuthModule {}
