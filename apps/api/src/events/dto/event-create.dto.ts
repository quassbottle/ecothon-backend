import { ApiProperty } from '@nestjs/swagger';
import { AgeRating } from '@prisma/client';
import { Transform } from 'class-transformer';
import { MaxLength, MinLength } from 'class-validator';

export class EventCreateDTO {
  @ApiProperty()
  @MinLength(1)
  @MaxLength(512)
  name: string;

  @MinLength(1)
  @ApiProperty()
  description: string;

  @Transform(({ value }: { value: string }) => {
    return new Date(value);
  })
  @ApiProperty({
    format: 'date',
  })
  startDate: Date;

  @ApiProperty()
  location: string;

  @ApiProperty({ enum: ['zero', 'six', 'twelve', 'sixteen', 'eightteen'] })
  ageRating: AgeRating;

  @ApiProperty({ format: 'url' })
  bannerUrl: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  tags: string[];
}
