import { Controller, Get } from '@nestjs/common';
import { EmailNotifierService } from './email-notifier.service';

@Controller()
export class EmailNotifierController {
  constructor(private readonly emailNotifierService: EmailNotifierService) {}

  @Get()
  getHello(): string {
    return this.emailNotifierService.getHello();
  }
}
