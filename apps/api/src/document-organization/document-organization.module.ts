import { Module } from '@nestjs/common';
import { DocumentOrganizationService } from './document-organization.service';
import { DocumentOrganizationController } from './document-organization.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [DocumentOrganizationService],
  controllers: [DocumentOrganizationController],
  imports: [HttpModule],
})
export class DocumentOrganizationModule {}
