import { Body, Controller, Post } from '@nestjs/common';
import { TelegramUserAddDto } from './dto/telegram-user-add.dto';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramAuthLoginDto } from './dto/telegram-auth-login.dto';
import { TokenDTO } from '../auth/dto/token.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('telegram_auth')
@Controller('telegram_auth')
export class TelegramAuthController {
  constructor(private telegramAuthService: TelegramAuthService) {}

  @Post('register')
  async register(@Body() dto: TelegramUserAddDto): Promise<TokenDTO> {
    return await this.telegramAuthService.register({ data: dto });
  }

  @Post('login')
  async login(@Body() dto: TelegramAuthLoginDto): Promise<TokenDTO> {
    return await this.telegramAuthService.login({ data: dto });
  }
}
