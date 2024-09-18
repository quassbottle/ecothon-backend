import { ApiProperty } from '@nestjs/swagger';
import { Tags } from '@prisma/client';

export class TagModel implements Tags {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export type TagCreate = Omit<TagModel, 'id'>;
