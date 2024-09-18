import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { init } from '@paralleldrive/cuid2';
import { FileModule } from '../file/file.module';

@Module({
  providers: [
    PostsService,
    {
      provide: 'POST_ID',
      useValue: init({ length: 16 }),
    },
  ],
  imports: [FileModule],
  controllers: [PostsController],
})
export class PostsModule {}
