import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { DocumentOrganizationService } from './document-organization.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DocumentGetDto } from './dto/document-get.dto';
import { DocumentsCreateDto } from './dto/documents-create.dto';
import { DocumentEditDto } from './dto/document-edit.dto';
import { mapToArrayResponse } from '@app/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/role.decorator';

@ApiTags('Documents')
@Controller('document')
export class DocumentOrganizationController {
  constructor(
    private readonly documentOrganizationService: DocumentOrganizationService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':tax_id/external')
  async getExternalDocument(@Param('tax_id') taxId: string) {
    return await this.documentOrganizationService.getExternalDocument(taxId);
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get(':id')
  async getDocument(@Param('id') id: string) {
    return await this.documentOrganizationService.getDocument(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createDocument(@Body() dto: DocumentsCreateDto) {
    return await this.documentOrganizationService.createDocument({data: dto});
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Patch()
  async editDocument(@Body() dto: DocumentEditDto) {
    return await this.documentOrganizationService.editDocument({data: dto});
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
  })
  @UseGuards(AuthGuard)
  @Roles('admin')
  async getAllDocuments(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return mapToArrayResponse(
      await this.documentOrganizationService.findAll({ limit, offset }),
      offset,
    );
  }
}
