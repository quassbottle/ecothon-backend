import { PrismaService } from '@app/db';
import { Injectable, Logger } from '@nestjs/common';
import { LeakyBucketService } from 'libs/rate-limiter/src';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramNotifierService {
  private readonly logger: Logger = new Logger(TelegramNotifierService.name);
  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private prisma: PrismaService,
    private rateLimiter: LeakyBucketService,
  ) {}

  async sendAllUsersByEventId(eventId: string) {
    const event = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: { participants: { select: { telegram: true } }, id: true },
    });

    let sent = 0;
    const total = event.participants.length;

    this.logger.log(
      `Notification for event ${eventId} has started (${total} users)`,
    );

    for (const user of event.participants) {
      try {
        // TODO: исправить сообщение
        if (user.telegram.telegramId) {
          await this.rateLimiter.execute(() =>
            this.bot.telegram.sendMessage(
              user.telegram.telegramId,
              `Событие № ${eventId} началось`,
            ),
          );
          sent++;
        }
      } catch (e) {
        this.logger.error(
          `Error sending notification to user ${user.telegram.userId}:`,
          e,
        );
      }
    }

    this.logger.log(
      `Notification for event ${eventId} has finished (${sent}/${total} sent)`,
    );
  }
}
