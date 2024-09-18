import { Module } from '@nestjs/common';
import { EmailNotifierController } from './email-notifier.controller';
import { EmailNotifierService } from './email-notifier.service';

@Module({
  imports: [],
  controllers: [EmailNotifierController],
  providers: [EmailNotifierService],
})
export class EmailNotifierModule {}
