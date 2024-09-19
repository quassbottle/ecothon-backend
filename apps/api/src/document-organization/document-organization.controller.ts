import { Controller, Get, Param } from '@nestjs/common';
import { DocumentOrganizationService } from './document-organization.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Documents')
@Controller('document')
export class DocumentOrganizationController {
  constructor(
    private readonly documentOrganizationService: DocumentOrganizationService,
  ) {}

  @Get(':tax_id')
  async getDocument(@Param('tax_id') taxId: string) {
    return await this.documentOrganizationService.getDocument(taxId);
  }
}
