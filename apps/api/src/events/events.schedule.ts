import { PrismaService } from '@app/db';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventsNotifierSchedule {
  private readonly logger = new Logger(EventsNotifierSchedule.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('EVENTS_NOTIFIER') private readonly kafka: ClientKafka,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    this.logger.warn('Notification has began');

    const now = new Date();
    const inWeek = now;
    inWeek.setDate(inWeek.getDate() + 7);

    const events = await this.prisma.events.findMany();

    for (const event of events) {
      await this.kafka.emit('notifications.email.all', { eventId: event.id });
    }

    console.log(inWeek);

    console.log(
      await this.prisma.events.findMany({
        where: {
          startDate: {
            gte: new Date(now.toDateString()),
          },
        },
      }),
    );
  }
}
