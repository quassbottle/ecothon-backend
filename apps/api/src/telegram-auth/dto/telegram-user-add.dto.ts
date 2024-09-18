import { ApiProperty } from '@nestjs/swagger';

export class TelegramUserAddDto {
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

  @ApiProperty()
  email: string;
}
