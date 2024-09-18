import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { TelegramUserAddDto } from './dto/telegram-user-add.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { TokenDTO } from '../auth/dto/token.dto';
import { TelegramAuthLoginDto } from './dto/telegram-auth-login.dto';
import {
  TelegramAuthHashInvalidException
} from '@app/common/errors/telegram-auth/telegram-auth-hash-invalid.exception';

@Injectable()
export class TelegramAuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async register(params: { data: TelegramUserAddDto }): Promise<TokenDTO> {
    const { data } = params;
    const { email } = data;

    await this.userService.assertUserExistsByEmail(email);
    const password = 'wqfqfqw';

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await this.userService.create({
      data: { email, password: hashedPassword },
    });

    await this.prisma.userTelegram.create({
      data: {
        userId: user.id,
        telegramId: data.telegramUsername,
        telegramHash: data.telegramHash,
        firstName: data.firstName,
        lastName: data.lastName,
        telegramUsername: data.telegramUsername,
      },
    });

    return await this.authService.generateTokenDto(user.id, user.role);
  }

  async login(params: { data: TelegramAuthLoginDto }): Promise<TokenDTO> {
    const { data } = params;
    const { telegramHash } = data;
    await this.telegramHashIsValid(telegramHash);
    const res = await this.prisma.userTelegram.findFirst({
      where: {
        telegramId: data.telegramId,
      },
      include: {
        user: true,
      },
    });
    if (!res) {
      throw new TelegramAuthHashInvalidException();
    }
    const { user } = res;

    return await this.authService.generateTokenDto(user.id, user.role);
  }

  async telegramHashIsValid(telegramHash: string): Promise<null> {
    return null;
  }
}
