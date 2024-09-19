import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentOrganizationService } from './document-organization.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DocumentsCreateDto } from './dto/documents-create.dto';
import { DocumentEditDto } from './dto/document-edit.dto';
import { mapToArrayResponse } from '@app/common';
import { HasTokenGuard } from '../auth/auth.guard';
import { Roles } from '../auth/role.decorator';

@ApiTags('Documents')
@Controller('document')
export class DocumentOrganizationController {
  constructor(
    private readonly documentOrganizationService: DocumentOrganizationService,
  ) {}

  @UseGuards(HasTokenGuard)
  @Get(':tax_id/external')
  async getExternalDocument(@Param('tax_id') taxId: string) {
    return await this.documentOrganizationService.getExternalDocument(taxId);
  }

  @UseGuards(HasTokenGuard)
  @Roles('admin')
  @Get(':id')
  async getDocument(@Param('id') id: string) {
    return await this.documentOrganizationService.getDocument(id);
  }

  @UseGuards(HasTokenGuard)
  @Post()
  async createDocument(@Body() dto: DocumentsCreateDto) {
    return await this.documentOrganizationService.createDocument({ data: dto });
  }

  @UseGuards(HasTokenGuard)
  @Roles('admin')
  @Patch()
  async editDocument(@Body() dto: DocumentEditDto) {
    return await this.documentOrganizationService.editDocument({ data: dto });
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
  @UseGuards(HasTokenGuard)
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
