import { ApiProperty } from '@nestjs/swagger';

export class DocumentGetDto {
  @ApiProperty()
  taxId: string;
}
