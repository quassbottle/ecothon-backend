import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Events } from '@prisma/client';

export type AgeRating = $Enums.AgeRating;

export class EventModel implements Events {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  bannerUrl: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  ageRating: AgeRating;

  @ApiProperty()
  participants: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  tags: string[];
}

export type EventCreate = Omit<
  EventModel,
  'id' | 'createdAt' | 'updatedAt' | 'participants'
> & {
  bannerUrl?: string;
};

export type EventUpdate = Partial<
  Omit<
    EventModel,
    'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'participants'
  >
>;
