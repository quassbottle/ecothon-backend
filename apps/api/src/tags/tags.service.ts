import { PrismaService } from '@app/db';
import { Inject, Injectable } from '@nestjs/common';
import { TagCreate } from './models/tag.model';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('TAG_ID') private readonly tagId: () => string,
  ) {}

  async filterExisting(params: { tags: string[] }) {
    params.tags = (params.tags || []).map((tag) =>
      tag.toUpperCase().trimStart().trimEnd(),
    );
    const { tags } = params;

    return await this.prisma.tags.findMany({
      where: {
        name: { in: tags },
      },
    });
  }

  async findByName(params: { name: string }) {
    const { name } = params;

    return this.prisma.tags.findFirst({
      where: { name: name.toUpperCase().trimStart().trimEnd() },
    });
  }

  async popular(params: { limit: number; offset: number }) {
    const { limit = 10, offset = 0 } = params;

    return this.prisma.tags.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
    });
  }

  async findById(params: { id: string }) {
    const { id } = params;

    return this.prisma.tags.findUnique({ where: { id } });
  }

  async create(params: { data: TagCreate }) {
    return this.prisma.tags.create({
      data: { ...params.data, id: this.tagId() },
    });
  }

  async upsertMany(params: { data: TagCreate[] }) {
    const { data } = params;

    // Remove repeating values and normalize
    const normalized = data.map((t) => ({
      name: t.name.toUpperCase().trimEnd().trimStart(),
    }));

    return this.prisma.$transaction(async (tx) => {
      const existingTags = await tx.tags.findMany({
        where: {
          name: {
            in: normalized.map((item) => item.name),
          },
        },
      });

      const newTags = await tx.tags.createManyAndReturn({
        data: normalized
          .filter((item) => !existingTags.some((t) => t.name === item.name))
          .map((item) => ({ ...item, id: this.tagId() })),
      });

      return [...newTags, ...existingTags];
    });
  }
}
