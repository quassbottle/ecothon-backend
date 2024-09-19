import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypes, Users } from '@prisma/client';

export class Document {
  @ApiProperty()
  id: string;

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
  user?: Users;

  @ApiProperty()
  fileId: string;
}
