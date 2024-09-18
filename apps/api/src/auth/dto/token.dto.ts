import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresAt: Date;
}
