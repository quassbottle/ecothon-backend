import { Inject, Injectable } from '@nestjs/common';
import { UserCreate, UserModel, UserUpdate } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@app/db';
import { UserNotFoundException } from '@app/common/errors/users/user.not-found.exception';
import { UserExistsByEmailException } from '@app/common/errors/users/user.exists-by-email.exception';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
    @Inject('USER_ID') private readonly userId: () => string,
  ) {}

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
      tags: data.tags ? [...data.tags] : undefined,
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
