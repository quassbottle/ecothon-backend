import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { $Enums } from '@prisma/client';

export class userWithPhotoUrlDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  @IsEnum({ enum: ['user', 'admin'] })
  role: $Enums.Role;
}
