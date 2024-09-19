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
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  tags?: string[];
}
