import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventCreate, EventModel, EventUpdate } from './models/event.model';
import { Role } from '@prisma/client';
import { SortOrder } from '../../../../libs/common/src/utils/query.types';
import { PrismaService } from '@app/db';
import { UserService } from '../user/user.service';
import { EventNotFoundException } from '@app/common/errors/events/event.not-found.exception';
import { AlreadyAttendingEventException } from '@app/common/errors/events/event.already-attending.exception';
import { EventCantModifyException } from '@app/common/errors/events/event.cant-modify.exception';
import { NotAttendingEventException } from '@app/common/errors/events/event.not-attending.exception';
import { TagsService } from '../tags/tags.service';
import moment from 'moment';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
    @Inject('EVENT_ID') private readonly eventId: () => string,
  ) {}

  async favorite(params: { userId: string; eventId: string }) {
    const { userId, eventId } = params;

    await this.userService.assertUserExistsById(userId);
    await this.assertEventExistsById(eventId);

    await this.prisma.users.update({
      where: { id: userId },
      data: {
        eventsFavorite: {
          connect: {
            id: eventId,
          },
        },
      },
    });

    return this.findById({ id: eventId });
  }

  async leave(params: { userId: string; eventId: string }) {
    const { userId, eventId } = params;

    await this.userService.assertUserExistsById(userId);
    await this.assertEventExistsById(eventId);

    const isAttending = await this.isAttending({ userId, eventId });

    if (!isAttending) {
      throw new NotAttendingEventException();
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: {
        attends: {
          disconnect: {
            id: eventId,
          },
        },
      },
    });

    return this.findById({ id: eventId });
  }

  async attend(params: { userId: string; eventId: string }) {
    const { userId, eventId } = params;

    await this.userService.assertUserExistsById(userId);
    await this.assertEventExistsById(eventId);

    const isAttending = await this.isAttending({ userId, eventId });

    if (isAttending) {
      throw new AlreadyAttendingEventException();
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: {
        attends: {
          connect: {
            id: eventId,
          },
        },
      },
    });

    return this.findById({ id: eventId });
  }

  async isAttending(params: { userId: string; eventId: string }) {
    const { userId, eventId } = params;

    const candidate = await this.prisma.users.findFirst({
      where: {
        id: userId,
        attends: {
          some: {
            id: eventId,
          },
        },
      },
    });

    return !!candidate;
  }

  async findById(params: { id: string }): Promise<EventModel> {
    const { id } = params;

    const { _count, ...db } = await this.prisma.events.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        bannerUrl: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        authorId: true,
        location: true,
        ageRating: true,
        latitude: true,
        longitude: true,
        tags: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return {
      ...db,
      tags: db.tags.map((tag) => tag.name),
      participants: _count.participants,
    };
  }

  async findAll(params: {
    limit?: number;
    offset?: number;
    userId: string;
    dateOrder?: SortOrder;
    start?: Date;
    end?: Date;
    tags?: string[];
  }): Promise<EventModel[]> {
    const { start, end } = params;

    if ((!start && end) || (start && !end)) {
      throw new BadRequestException('Either start or end must be provided');
    }

    const whereDateStartEnd =
      start && end
        ? {
            startDate: {
              gte: start,
              lte: end,
            },
          }
        : undefined;

    const whereParticipants = params.userId
      ? {
          participants: {
            some: {
              id: params.userId,
            },
          },
        }
      : undefined;

    const orderBy = params.dateOrder
      ? {
          startDate: params.dateOrder,
        }
      : undefined;

    const attending = params.userId
      ? {
          where: {
            attends: {
              some: {
                id: params.userId,
              },
            },
          },
        }
      : undefined;

    const tagsFilter =
      params.tags && params.tags.length > 0
        ? {
            tags: {
              some: {
                name: {
                  in:
                    typeof params.tags === 'string'
                      ? [params.tags]
                      : params.tags,
                },
              },
            },
          }
        : undefined;

    console.log(tagsFilter);

    const events = await this.prisma.events.findMany({
      where: {
        ...whereDateStartEnd,
        ...whereParticipants,
        ...tagsFilter,
      },
      take: params.limit ?? 10,
      skip: params.offset ?? 0,
      select: {
        id: true,
        name: true,
        description: true,
        bannerUrl: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        authorId: true,
        location: true,
        ageRating: true,
        longitude: true,
        latitude: true,
        tags: true,
        _count: {
          select: {
            participants: true,
          },
        },
        participants: attending,
      },
      orderBy,
    });

    return events.map(({ _count, participants, ...db }) => {
      return {
        ...db,
        tags: db.tags.map((tag) => tag.name),
        participants: _count.participants,
        attending: !!participants ? participants.length > 0 : false,
      };
    });
  }

  async findFavoriteByUserId(params: {
    id: string;
    limit?: number;
    offset?: number;
    dateOrder?: SortOrder;
  }) {
    const { id, limit, offset } = params;

    await this.userService.assertUserExistsById(id);

    const orderBy = params.dateOrder
      ? {
          startDate: params.dateOrder,
        }
      : undefined;

    const events = await this.prisma.events.findMany({
      where: {
        usersFavorite: {
          some: {
            id,
          },
        },
      },
      take: limit ?? 10,
      skip: offset ?? 0,
      select: {
        id: true,
        name: true,
        description: true,
        bannerUrl: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        authorId: true,
        location: true,
        ageRating: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy,
    });

    return events.map(({ _count, ...db }) => {
      return {
        ...db,
        participants: _count.participants,
      };
    });
  }

  async create(params: { data: EventCreate }): Promise<EventModel> {
    const { data } = params;

    const dbTags = await this.tagsService.upsertMany({
      data: data.tags.map((name) => ({ name })),
    });

    const created = await this.prisma.events.create({
      data: {
        ...data,
        id: this.eventId(),
        tags: {
          connect: dbTags,
        },
      },
    });

    return this.findById({ id: created.id });
  }

  async assertEventExistsById(id: string): Promise<void> {
    if (!id || id.length === 0) {
      throw new EventNotFoundException(id ?? '');
    }
    const candidate = await this.prisma.events.findFirst({ where: { id } });

    if (!candidate) {
      throw new EventNotFoundException(id);
    }
  }

  async participants(params: { id: string; limit?: number; offset?: number }) {
    const { id, limit, offset } = params;

    await this.assertEventExistsById(id);

    return this.prisma.users.findMany({
      where: {
        attends: {
          some: {
            id,
          },
        },
      },
      take: limit ?? 10,
      skip: offset ?? 0,
    });
  }

  async assertCanModifyEvent(params: {
    userId: string;
    role: Role;
    eventId: string;
  }) {
    const { userId, role, eventId } = params;

    const event = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: {
        authorId: true,
      },
    });

    if ((!event || event.authorId !== userId) && role !== 'admin') {
      throw new EventCantModifyException(eventId);
    }
  }

  async update(params: { id: string; data: EventUpdate }) {
    const { id, data } = params;

    await this.assertEventExistsById(id);

    if (data.tags) {
      const dbTags = await this.tagsService.upsertMany({
        data: data.tags.map((name) => ({ name })),
      });

      await this.prisma.events.update({
        where: { id },
        data: {
          tags: {
            connect: dbTags,
          },
        },
      });
    }

    delete data.tags;

    await this.prisma.events.update({
      where: { id },
      data: data as Omit<EventUpdate, 'tags'>,
    });
  }

  async analytics(params: { eventId: string }) {
    const { eventId } = params;

    await this.assertEventExistsById(eventId);

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
      count: {
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
      },
    };
  }
}
