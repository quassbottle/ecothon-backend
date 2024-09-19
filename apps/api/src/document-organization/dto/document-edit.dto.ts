import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypes } from '@prisma/client';

export class DocumentEditDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: DocumentTypes,
  })
  documentType: DocumentTypes;
}
