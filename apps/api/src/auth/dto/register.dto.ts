import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDTO {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @ApiProperty()
  @IsOptional()
  tags?: string[];
}
