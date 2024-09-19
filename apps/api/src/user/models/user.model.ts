import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Users } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UserModel implements Users {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  trees: number;

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
  gender: $Enums.Gender;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  tags?: string[];
}

export type UserCreate = Omit<
  UserModel,
  | 'id'
  | 'createdAt'
  | 'role'
  | 'avatarUrl'
  | 'latitude'
  | 'longitude'
  | 'birthdate'
  | 'gender'
  | 'trees'
>;

export type UserUpdate = Partial<
  Omit<UserModel, 'id' | 'createdAt'> & { avatarUrl: string }
>;
