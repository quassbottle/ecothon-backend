import { AgeRating } from '@prisma/client';
import { EventUpdate } from '../models/event.model';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class EventUpdateDTO implements EventUpdate {
  @ApiProperty()
  @MinLength(1)
  @MaxLength(512)
  @IsOptional()
  name?: string;

  @MinLength(1)
  @ApiProperty()
  @IsOptional()
  description?: string;

  @Transform(({ value }: { value: string }) => {
    return new Date(value);
  })
  @IsOptional()
  @ApiProperty({
    format: 'date',
  })
  startDate?: Date;

  @ApiProperty()
  @IsOptional()
  location?: string;

  @ApiProperty({ enum: ['zero', 'six', 'twelve', 'sixteen', 'eightteen'] })
  @IsOptional()
  ageRating?: AgeRating;

  @ApiProperty({ format: 'url' })
  @IsOptional()
  bannerUrl?: string;
}
