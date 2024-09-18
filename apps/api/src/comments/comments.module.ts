import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { init } from '@paralleldrive/cuid2';
import { CommentsController } from './comments.controller';
import { EventsModule } from '../events/events.module';

@Module({
  providers: [
    CommentsService,
    {
      provide: 'COMMENT_ID',
      useValue: init({ length: 24 }),
    },
  ],
  exports: [CommentsService],
  imports: [forwardRef(() => EventsModule)],
  controllers: [CommentsController],
})
export class CommentsModule {}
