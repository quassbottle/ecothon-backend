import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

export class PostCreateDTO {
  @ApiProperty()
  @MinLength(1)
  @MaxLength(512)
  name: string;

  @MinLength(1)
  @ApiProperty()
  content: string;

  @ApiProperty({ format: 'url' })
  bannerUrl: string;

  @ApiProperty()
  fileId: string;
}
