import { Controller } from '@nestjs/common';
import { MessagePattern, Transport, Payload } from '@nestjs/microservices';
import { EmailNotifierService } from './email-notifier.service';
import { NotifyAllMessageDto } from '@app/common/messages/notify-all-message.dto';

@Controller()
export class EmailNotifierController {
  constructor(private readonly telegramNotifierService: EmailNotifierService) {}

  @MessagePattern('notifications.telegram.event-soon', Transport.KAFKA)
  async eventSoon() {
    console.log('test');
  }

  @MessagePattern('notifications.email.all', Transport.KAFKA)
  async notifyAboutEvent(@Payload() data: NotifyAllMessageDto) {
    try {
      if (data.eventId) {
        await this.telegramNotifierService.sendAllUsersByEventId(data.eventId);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
