import { Module } from '@nestjs/common';
import { DocumentOrganizationService } from './document-organization.service';
import { DocumentOrganizationController } from './document-organization.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '@app/db';
import { init } from '@paralleldrive/cuid2';

@Module({
  providers: [
    DocumentOrganizationService,
    {
      provide: 'DOCUMENT_ID',
      useValue: init({ length: 16 }),
    },
  ],
  controllers: [DocumentOrganizationController],
  imports: [HttpModule, PrismaModule],
})
export class DocumentOrganizationModule {}
