import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypes } from '@prisma/client';

export class DocumentsCreateDto {
  @ApiProperty()
  organizationName: string;

  @ApiProperty()
  taxId: string;

  @ApiProperty()
  ogrn: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  emailOrganization: string;

  @ApiProperty()
  activityCode: string;

  @ApiProperty()
  documentType: DocumentTypes;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  file: File;

  @ApiProperty()
  fileUrl: string;
}