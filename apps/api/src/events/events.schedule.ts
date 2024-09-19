import { PrismaService } from '@app/db';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventNotificationsType } from '@prisma/client';
import * as moments from 'moment';

@Injectable()
export class EventsNotifierSchedule {
  private readonly logger = new Logger(EventsNotifierSchedule.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('EVENTS_NOTIFIER') private readonly kafka: ClientKafka,
    @Inject('EVENT_NOTIFICATION_ID') private readonly id: () => string,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleBeforeWeek() {
    this.logger.warn('Notification has began');

    const inWeek = moments().add(7, 'd');

    const inWeekStart = inWeek
      .clone()
      .startOf('day')
      .add(-1, 'd')
      .hour(26)
      .minute(59)
      .second(59);
    const inWeekEnd = inWeekStart.clone().add(1, 'day').add(1, 'second');

    const events = await this.prisma.events.findMany({
      where: {
        startDate: {
          gte: inWeekStart.toISOString(),
          lte: inWeekEnd.add(1, 'day').toISOString(),
        },
        notifications: {
          none: {
            type: 'WEEKLY',
          },
        },
      },
    });

    this.logger.log(
      `Found ${events.length} events in the next week. Notification has begun.`,
    );

    await this.prisma.eventNotifications.createMany({
      data: [
        ...events.map((item) => ({
          id: this.id(),
          eventId: item.id,
          type: 'WEEKLY' as EventNotificationsType,
        })),
      ],
    });

    for (const event of events) {
      this.kafka.emit('notifications.email.all', { eventId: event.id });
      this.kafka.emit('notifications.telegram.all', { eventId: event.id });
    }
  }
}
