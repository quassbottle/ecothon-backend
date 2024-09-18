import { ApiProperty } from '@nestjs/swagger';
import { Posts } from '@prisma/client';

export class PostModel implements Posts {
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

  authorId: string;
}

export type PostCreate = Omit<PostModel, 'id' | 'createdAt' | 'updatedAt'> & {
  bannerUrl?: string;
};

export type PostUpdate = Partial<
  Omit<PostModel, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>
>;
