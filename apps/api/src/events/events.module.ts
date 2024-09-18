import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { init } from '@paralleldrive/cuid2';
import { CommentsModule } from '../comments/comments.module';
import { UserModule } from '../user/user.module';
import { EventsNotifierSchedule } from './events.schedule';
import { TagsModule } from '../tags/tags.module';
import { FileModule } from '../file/file.module';

@Module({
  providers: [
    EventsNotifierSchedule,
    EventsService,
    {
      provide: 'EVENT_ID',
      useValue: init({ length: 16 }),
    },
  ],
  controllers: [EventsController],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CommentsModule),
    TagsModule,
    FileModule
  ],
})
export class EventsModule {}
