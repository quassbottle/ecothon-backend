import { ApiProperty } from '@nestjs/swagger';

export class TelegramAuthModel {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  telegramId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  telegramHash: string;

  @ApiProperty()
  telegramUsername: string;
}
