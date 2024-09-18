import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhotoDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  fileId: string;
}
