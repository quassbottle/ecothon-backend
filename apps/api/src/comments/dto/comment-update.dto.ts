import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Max, MaxLength, Min } from 'class-validator';

export class CommentUpdateDTO {
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiProperty()
  rating?: number;

  @MaxLength(1024)
  @IsOptional()
  @ApiProperty()
  content?: string;
}
