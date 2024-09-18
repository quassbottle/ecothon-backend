import { Module } from '@nestjs/common';
import { StorageService as StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { PrismaModule } from '@app/db';
import { ConfigModule } from '@nestjs/config';
import { init } from '@paralleldrive/cuid2';

@Module({
  providers: [
    StorageService,
    {
      provide: 'FILE_ID',
      useValue: init({ length: 32 }),
    },
  ],
  exports: [StorageService],
  imports: [PrismaModule, ConfigModule.forRoot()],
  controllers: [StorageController],
})
export class StorageModule {}
