import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class PostUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @MinLength(1)
  @MaxLength(512)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(1)
  content?: string;

  @ApiProperty({ format: 'url' })
  @IsOptional()
  bannerUrl?: string;
}
