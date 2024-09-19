import { Inject, Injectable } from '@nestjs/common';
import {
  CommentCreate,
  CommentModel,
  CommentUpdate,
} from './models/comment.model';
import { Role } from '@prisma/client';
import { CommentCantModifyException } from '@app/common/errors/comments/comments.cant-modify.exception';
import { PrismaService } from '@app/db';
import { CommentNotFoundException } from '@app/common/errors/comments/comments.not-found.exception';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
    @Inject('COMMENT_ID') private readonly commentId: () => string,
  ) {}

  async assertCanModifyComment(params: {
    userId: string;
    commentId: string;
    role: Role;
  }) {
    const { userId, commentId, role } = params;

    const candidate = await this.prisma.comments.findFirst({
      where: { id: commentId },
      select: { userId: true },
    });

    if ((!candidate || candidate.userId !== userId) && role !== 'admin') {
      throw new CommentCantModifyException(commentId);
    }
  }

  async assertExistsById(id: string): Promise<void> {
    const candidate = await this.prisma.comments.findFirst({ where: { id } });

    if (!candidate) {
      throw new CommentNotFoundException(id);
    }
  }

  async create(params: { data: CommentCreate }): Promise<CommentModel> {
    const { data } = params;

    const created = await this.prisma.comments.create({
      data: {
        ...data,
        id: this.commentId(),
      },
    });

    this.analyticsService.emit({
      event: 'comment',
      userId: data.userId,
      eventId: data.eventId,
    });

    return created;
  }

  delete(params: { id: string }): Promise<CommentModel> {
    const { id } = params;

    return this.prisma.comments.delete({ where: { id } });
  }

  update(params: { id: string; data: CommentUpdate }): Promise<CommentModel> {
    const { id, data } = params;

    return this.prisma.comments.update({
      where: { id },
      data,
    });
  }

  findById(params: { id: string }): Promise<CommentModel> {
    const { id } = params;

    return this.prisma.comments.findFirst({ where: { id } });
  }

  async findByEventId(params: {
    id: string;
    skip?: number;
    take?: number;
  }): Promise<CommentModel[]> {
    const { id, skip, take } = params;

    return this.prisma.comments.findMany({
      where: {
        eventId: id,
      },
      skip,
      take,
    });
  }

  async findByUserId(params: {
    id: string;
    skip?: number;
    take?: number;
  }): Promise<CommentModel[]> {
    const { id, skip, take } = params;

    return this.prisma.comments.findMany({
      where: {
        userId: id,
      },
      skip,
      take,
    });
  }
}
