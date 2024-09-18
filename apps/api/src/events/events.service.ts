import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventCreate, EventModel, EventUpdate } from './models/event.model';
import { EventNotFoundException } from './exceptions/event.not-found.exception';
import { AlreadyAttendingEventException } from './exceptions/event.already-attending.exception';
import { NotAttendingEventException } from './exceptions/event.not-attending.exception';
import { Prisma, Role } from '@prisma/client';
import { EventCantModifyException } from './exceptions/event.cant-modify.exception';
import { SortOrder } from '../../../../libs/common/src/utils/query.types';
import { PrismaService } from '@app/db';
import { UserService } from '../user/user.service';
import { TagsService } from '../tags/tags.service';
import { FileService } from '../file/file.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
    private readonly fileService: FileService,
    @Inject('EVENT_ID') private readonly eventId: () => string,
  ) {}

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
        fileId: true,
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
      fileId: undefined,
      bannerUrl: await this.fileService.getFileById(db.fileId),
      tags: db.tags.map((tag) => tag.name),
      participants: _count.participants,
    };
  }

  async findAll(params: {
    limit?: number;
    offset?: number;
    userId?: string;
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

    console.log(typeof params.tags);

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
        tags: true,
        fileId: true,
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy,
    });

    return Promise.all(
      events.map(async ({ _count, ...db }) => {
      return {
        ...db,
        bannerUrl: await this.fileService.getFileById(db.fileId),
        fileId: undefined,
        tags: db.tags.map((tag) => tag.name),
        participants: _count.participants,
      };
    }));
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
}
