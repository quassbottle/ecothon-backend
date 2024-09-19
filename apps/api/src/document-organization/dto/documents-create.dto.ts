import { ApiProperty } from '@nestjs/swagger';


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
  userId: string;

  @ApiProperty()
  fileId: string;
}
