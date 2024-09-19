import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
import { EventAnalyticsType } from './analytics.types';
import * as moment from 'moment';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ANALYTICS_ID') private readonly id: () => string,
  ) {}

  async emit(params: {
    event: EventAnalyticsType;
    eventId: string;
    userId: string;
  }) {
    const { event, userId, eventId } = params;

    const user = await this.prisma.users.findFirst({
      where: { id: userId },
    });

    if (!user) return;

    await this.prisma.eventAnalyticsEvents.create({
      data: {
        id: this.id(),
        eventId: eventId,
        eventType: event,
        userBirthdate: user.birthdate,
        userGender: user.gender,
        userLongitude: user.longitude,
        userLatitude: user.latitude,
      },
    });
  }

  async aggregate(params: {
    eventType: EventAnalyticsType;
    eventId: string;
    period: { start: Date; end: Date };
  }) {
    const { eventType, eventId, period } = params;

    const count = await this.prisma.eventAnalyticsEvents.aggregate({
      _count: true,
      where: {
        createdAt: {
          gte: moment(period.start)
            .hour(23)
            .minute(59)
            .second(59)
            .toISOString(),
          lte: moment(period.end)
            .hour(23)
            .minute(59)
            .second(59)
            .add(1, 'day')
            .toISOString(),
        },
        eventId,
        eventType,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return count._count;
  }

  async total(params: { eventId: string }) {
    const { eventId } = params;

    const total = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    console.log(total, eventId);

    const totalParticipantsCount = total._count.participants;

    const femaleParticipants = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: {
              where: {
                gender: 'female',
              },
            },
          },
        },
      },
    });

    const femaleParticipantsCount = femaleParticipants._count.participants;

    const maleParticipants = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: {
              where: {
                gender: 'male',
              },
            },
          },
        },
      },
    });

    const maleParticipantsCount = maleParticipants._count.participants;

    const unknownParticipantsCount =
      totalParticipantsCount - maleParticipantsCount - femaleParticipantsCount;

    const totalAdult = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: {
              where: {
                birthdate: {
                  not: null,
                  gte: moment().add(-18, 'y').toISOString(),
                },
              },
            },
          },
        },
      },
    });

    const totalAdultCount = totalAdult._count.participants;

    const totalSixteen = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: {
              where: {
                birthdate: {
                  not: null,
                  gte: moment().add(-16, 'y').toISOString(),
                },
              },
            },
          },
        },
      },
    });

    const totalSixteenCount = totalSixteen._count.participants;

    const totalTwelve = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: {
              where: {
                birthdate: {
                  not: null,
                  gte: moment().add(-12, 'y').toISOString(),
                },
              },
            },
          },
        },
      },
    });

    const totalTwelveCount = totalTwelve._count.participants;

    const totalSix = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        _count: {
          select: {
            participants: {
              where: {
                birthdate: {
                  not: null,
                  gte: moment().add(-6, 'y').toISOString(),
                },
              },
            },
          },
        },
      },
    });

    const totalSixCount = totalSix._count.participants;

    return {
      gender: {
        total: totalParticipantsCount,
        female: femaleParticipantsCount,
        male: maleParticipantsCount,
        unknown: unknownParticipantsCount,
      },
      age: {
        adult: totalAdultCount,
        sixteen: totalSixteenCount,
        twelve: totalTwelveCount,
        six: totalSixCount,
      },
    };
  }
}
