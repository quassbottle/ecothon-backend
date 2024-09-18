import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { PrismaModule } from '@app/db';

@Module({
  imports: [PrismaModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
