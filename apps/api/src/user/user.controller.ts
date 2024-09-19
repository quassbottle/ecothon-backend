import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithJwt } from '../auth/auth.types';
import { ApiOkArrayResponse, Serialize, SortOrder } from '@app/common';
import { EventModel } from '../events/models/event.model';
import { EventsService } from '../events/events.service';
import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventsService: EventsService,
  ) {}

  @ApiOkResponse({ type: UserModel })
  @UseGuards(AuthGuard)
  @Serialize(UserModel)
  @Get('me')
  async getMe(@Req() req: RequestWithJwt) {
    const id = req.jwtPayload.sub;

    await this.userService.assertUserExistsById(id);

    return this.userService.findById({ id });
  }

  @ApiOkResponse({ type: UserModel })
  @Serialize(UserModel)
  @Get(':id')
  async findById(@Param('id') id: string) {
    await this.userService.assertUserExistsById(id);

    return this.userService.findById({ id });
  }

  @ApiOkArrayResponse(EventModel)
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: SortOrder,
  })
  @Get(':id/favorite')
  async findFavoriteEventsById(
    @Param('id') id: string,
    @Query('take', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('skip', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('order', new ParseEnumPipe(SortOrder, { optional: true }))
    dateOrder?: SortOrder,
  ) {
    await this.userService.assertUserExistsById(id);

    return this.eventsService.findFavoriteByUserId({
      id,
      limit,
      offset,
      dateOrder,
    });
  }
}
