import { ApiProperty } from '@nestjs/swagger';

export class FileModel {
  @ApiProperty({
    type: 'string',
  })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  uploaded: boolean;

  @ApiProperty()
  url: string;

  @ApiProperty()
  region: string;
}
