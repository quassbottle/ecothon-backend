import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithJwt } from '../auth/auth.types';
import { Serialize } from '@app/common';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { UserOtherUpdateException } from './exceptions/user.other-update.exception';
import { userWithPhotoUrlDto } from './dto/user-with-photo-url.dto';

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: userWithPhotoUrlDto })
  @Serialize(UserModel)
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithJwt): Promise<{
    createdAt: Date;
    role: 'user' | 'admin';
    avatarUrl: Promise<any>;
    id: string;
    email: string;
  }> {
    const id = req.jwtPayload.sub;

    await this.userService.assertUserExistsById(id);
    const user = await this.userService.findById({ id });

    return {
      avatarUrl: await this.userService.getAvatarUrl({ id }),
      createdAt: user.createdAt,
      email: user.email,
      role: user.role,
      id: id,
    };
  }

  @ApiOkResponse({ type: UserModel })
  @Serialize(UserModel)
  @Get(':id')
  async findById(@Param('id') id: string) {
    await this.userService.assertUserExistsById(id);

    return this.userService.findById({ id });
  }

  @UseGuards(AuthGuard)
  @Patch('update_photo')
  async updatePhoto(@Body() dto: UpdatePhotoDto, @Req() req: RequestWithJwt) {
    if (req.jwtPayload.sub !== dto.userId) {
      throw new UserOtherUpdateException();
    }
    return await this.userService.updatePhoto({ data: dto });
  }
}
