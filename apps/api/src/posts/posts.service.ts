import { Inject, Injectable } from '@nestjs/common';
import { PostCreate, PostModel, PostUpdate } from './models/post.model';
import { PrismaService } from '@app/db';
import { PostNotFoundException } from '@app/common/errors/posts/post.not-found.exception';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('POST_ID') private readonly postId: () => string,
  ) {}

  delete(params: { id: string }) {
    const { id } = params;

    return this.prisma.posts.delete({ where: { id } });
  }

  async findById(params: { id: string }) {
    const { id } = params;

    return this.prisma.posts.findFirst({ where: { id } });
  }

  async assertPostExistsById(id: string) {
    const candidate = await this.findById({ id });

    if (!candidate) {
      throw new PostNotFoundException(`Post with id ${id} not found.`);
    }
  }

  async create(params: { data: PostCreate }) {
    const { data } = params;

    return this.prisma.posts.create({
      data: {
        ...data,
        id: this.postId(),
      },
    });
  }

  async update(params: { id: string; data: PostUpdate }) {
    const { id, data } = params;

    return this.prisma.posts.update({
      where: { id },
      data,
    });
  }

  async findAll(params: {
    limit?: number;
    offset?: number;
  }): Promise<PostModel[]> {
    const { limit, offset } = params;

    return this.prisma.posts.findMany({
      take: limit ?? 10,
      skip: offset ?? 0,
      select: {
        id: true,
        bannerUrl: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
    });
  }
}
