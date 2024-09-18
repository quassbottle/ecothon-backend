import { ApiProperty } from '@nestjs/swagger';

export class PostGetDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  bannerUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}