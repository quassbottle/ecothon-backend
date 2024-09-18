import { ApiProperty } from '@nestjs/swagger';
import { Max, MaxLength, Min } from 'class-validator';

export class CommentCreateDTO {
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating: number;

  @MaxLength(1024)
  @ApiProperty()
  content: string;
}
