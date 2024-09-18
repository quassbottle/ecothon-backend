import { ApiProperty } from '@nestjs/swagger';

export class ArrayResponse<T> {
  @ApiProperty()
  count: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  data: T[];
}

export const mapToArrayResponse = <T>(data: T[], offset?: number) => {
  if (!data) {
    return {
      count: 0,
      limit: 0,
      offset: 0,
      data: [],
    };
  }
  return {
    count: data.length,
    limit: data.length,
    offset: offset ?? 0,
    data,
  };
};
