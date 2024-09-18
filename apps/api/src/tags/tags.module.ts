import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { init } from '@paralleldrive/cuid2';
import { TagsController } from './tags.controller';

@Module({
  providers: [
    TagsService,
    {
      provide: 'TAG_ID',
      useValue: init({ length: 24 }),
    },
  ],
  exports: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
