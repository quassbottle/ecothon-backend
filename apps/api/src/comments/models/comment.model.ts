import { ApiProperty } from '@nestjs/swagger';
import { Comments } from '@prisma/client';

export class CommentModel implements Comments {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type CommentCreate = Omit<
  CommentModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type CommentUpdate = Partial<
  Omit<CommentModel, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'eventId'>
>;
