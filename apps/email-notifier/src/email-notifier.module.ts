import { Module } from '@nestjs/common';
import { EmailNotifierController } from './email-notifier.controller';
import { EmailNotifierService } from './email-notifier.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@app/db';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
          template: {
            // { "eventId": "swsj1iwol5vfxuuy" }
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
  ],
  controllers: [EmailNotifierController],
  providers: [EmailNotifierService],
})
export class EmailNotifierModule {}
