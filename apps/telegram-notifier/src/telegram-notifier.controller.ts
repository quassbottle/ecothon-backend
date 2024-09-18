import { Controller } from '@nestjs/common';
import { TelegramNotifierService } from './telegram-notifier.service';
import { MessagePattern, Transport, Payload } from '@nestjs/microservices';
import { NotifyAllMessageDto } from '@app/common/messages/notify-all-message.dto';

@Controller()
export class TelegramNotifierController {
  constructor(
    private readonly telegramNotifierService: TelegramNotifierService,
  ) {}

  @MessagePattern('notifications.telegram.event-soon', Transport.KAFKA)
  async eventSoon() {
    console.log('test');
  }

  @MessagePattern('notifications.telegram.all', Transport.KAFKA)
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
