import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { init } from '@paralleldrive/cuid2';
import { EventsModule } from '../events/events.module';
import { PrismaModule } from '@app/db';
import { TagsModule } from '../tags/tags.module';

@Module({
  exports: [UserService],
  imports: [
    PrismaModule,
    forwardRef(() => EventsModule),
    forwardRef(() => TagsModule),
  ],
  providers: [
    UserService,
    {
      provide: 'USER_ID',
      useValue: init({ length: 16 }),
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
