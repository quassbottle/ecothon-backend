import { PrismaService } from '@app/db';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventsNotifierSchedule {
  private readonly logger = new Logger(EventsNotifierSchedule.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    this.logger.warn('Notification has began');

    const now = new Date();
    const inWeek = now;
    inWeek.setDate(inWeek.getDate() + 7);

    // console.log(inWeek);

    // console.log(
    //   await this.prisma.events.findMany({
    //     where: {
    //       startDate: {
    //         gte: new Date(now.toDateString()),
    //       },
    //     },
    //   }),
    // );
  }
}
