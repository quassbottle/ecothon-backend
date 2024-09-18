import { Inject, Injectable } from '@nestjs/common';
import { PostNotFoundException } from './exceptions/post.not-found.exception';
import { PostCreate, PostModel, PostUpdate } from './models/post.model';
import { PrismaService } from '@app/db';
import { PostGetDto } from './dto/post-get.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class PostsService {
  constructor(
    private fileService: FileService,
    private readonly prisma: PrismaService,
    @Inject('POST_ID') private readonly postId: () => string,
  ) {}

  delete(params: { id: string }) {
    const { id } = params;

    return this.prisma.posts.delete({ where: { id } });
  }

  async findById(params: { id: string }): Promise<PostModel | null> {
    const { id } = params;

    const candidate = await this.prisma.posts.findFirst({
      where: { id: id },
      include: { file: true },
    });

    return {
      ...candidate,
      file: undefined,
      bannerUrl: candidate?.file?.url
    };
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
  }): Promise<PostGetDto[]> {
    const { limit, offset } = params;

    const candidate = await this.prisma.posts.findMany({
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
        fileId: true,
      },
    });

    return Promise.all(
      candidate.map(async (i) => {
      i.bannerUrl = await this.fileService.getFileById(i.fileId) ?? null;
      i.fileId = undefined;
      return i;
    }));
  }
}
