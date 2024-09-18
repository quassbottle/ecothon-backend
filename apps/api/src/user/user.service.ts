import { Inject, Injectable } from '@nestjs/common';
import { UserCreate, UserModel, UserUpdate } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from './exceptions/user.not-found.exception';
import { UserExistsByEmailException } from './exceptions/user.exists-by-email.exception';
import { PrismaService } from '@app/db';
import { TagsService } from '../tags/tags.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { FileNotFoundExceptionDto } from './exceptions/file.not-found.exception.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
    @Inject('USER_ID') private readonly userId: () => string,
  ) {}

  async getAvatarUrl(params: { id: string }): Promise<string | null> {
    const { id } = params;
    const candidate = await this.prisma.users.findFirst({
      where: { id },
      select: { file: true },
    });

    return candidate.file?.url ?? null;
  }

  async assertUserExistsByEmail(email: string): Promise<void> {
    const candidate = await this.prisma.users.findFirst({ where: { email } });

    if (candidate) {
      throw new UserExistsByEmailException(email);
    }
  }

  async assertUserExistsById(id: string): Promise<void> {
    const candidate = await this.prisma.users.findFirst({ where: { id } });

    if (!candidate) {
      throw new UserNotFoundException(id);
    }
  }

  async updatePhoto(params: {data: UpdatePhotoDto}) {
    const { data } = params;
    const user = this.prisma.users.findFirst({where: { id: data.userId } });

    if (!user) {
      throw new UserNotFoundException(data.userId);
    }

    const file = this.prisma.file.findFirst({where: {id: data.fileId}})

    if (!file) {
      throw new FileNotFoundExceptionDto();
    }

    const userUpdated = this.prisma.users.update({
      where: { id: data.userId },
      data: { fileId: data.fileId },
    });

    return userUpdated;
  }

  async findById(params: { id: string }): Promise<UserModel | null> {
    const { id } = params;

    return this.prisma.users.findFirstOrThrow({ where: { id } });
  }

  async findByEmail(params: { email: string }): Promise<UserModel | null> {
    const { email } = params;

    return this.prisma.users.findFirst({ where: { email } });
  }

  async create(params: { data: UserCreate }): Promise<UserModel | null> {
    const { data } = params;

    await this.assertUserExistsByEmail(data.email);

    // Hash the password on create
    data.password = bcrypt.hashSync(data.password, 10);

    const tags = await this.tagsService.filterExisting({
      tags: data.tags,
    });

    return this.prisma.users.create({
      data: {
        ...data,
        tags: {
          connect: tags,
        },
        id: this.userId(),
      },
    });
  }

  async update(params: {
    id: string;
    data: UserUpdate;
  }): Promise<UserModel | null> {
    const { id, data } = params;

    await this.assertUserExistsById(id);

    const tags = await this.tagsService.filterExisting({
      tags: [...data.tags],
    });

    return this.prisma.users.update({
      where: { id },
      data: {
        ...data,
        tags: {
          connect: tags,
        },
      },
    });
  }
}
