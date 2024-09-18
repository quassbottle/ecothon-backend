import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Users } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UserModel implements Users {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  @IsEnum({ enum: ['user', 'admin'] })
  role: $Enums.Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  tags?: string[];
}

export type UserCreate = Omit<
  UserModel,
  'id' | 'createdAt' | 'role' | 'avatarUrl'
>;

export type UserUpdate = Partial<
  Omit<UserModel, 'id' | 'createdAt'> & { avatarUrl: string }
>;
