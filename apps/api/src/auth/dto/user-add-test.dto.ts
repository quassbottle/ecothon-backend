import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserAddTestDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;
}
