import { Module } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramAuthController } from './telegram-auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [TelegramAuthService],
  controllers: [TelegramAuthController],
})
export class TelegramAuthModule {}
