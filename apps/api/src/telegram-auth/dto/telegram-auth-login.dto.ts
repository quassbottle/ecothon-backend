import { ApiProperty } from '@nestjs/swagger';

export class TelegramAuthLoginDto {
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
