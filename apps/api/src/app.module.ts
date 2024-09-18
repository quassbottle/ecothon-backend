import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentsModule } from './comments/comments.module';
import { PrismaModule } from '@app/db';
import { TelegramAuthModule } from './telegram-auth/telegram-auth.module';
import { TagsModule } from './tags/tags.module';
import { DocumentOrganizationModule } from './document-organization/document-organization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    PostsModule,
    EventsModule,
    CommentsModule,
    TelegramAuthModule,
    TagsModule,
    DocumentOrganizationModule,
  ],
})
export class AppModule {}
