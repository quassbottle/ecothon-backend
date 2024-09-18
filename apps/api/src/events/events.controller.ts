import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EventUpdateDTO } from './dto/event-update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithJwt } from '../auth/auth.types';
import { CommentsService } from '../comments/comments.service';
import { CommentCreateDTO } from '../comments/dto/comment-create.dto';
import { CommentModel } from '../comments/models/comment.model';
import { UserModel } from '../user/models/user.model';
import { EventCreateDTO } from './dto/event-create.dto';
import { EventModel } from './models/event.model';
import {
  ApiOkArrayResponse,
  mapToArrayResponse,
  Serialize,
  SerializeArray,
  SortOrder,
} from '@app/common';

@ApiBearerAuth('jwt')
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly commentsService: CommentsService,
  ) {}

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @Get(':id')
  async getById(@Param('id') id: string) {
    await this.eventsService.assertEventExistsById(id);

    return this.eventsService.findById({ id });
  }

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @UseGuards(AuthGuard)
  @Post(':id/favorite')
  async favorite(@Param('id') id: string, @Req() req: RequestWithJwt) {
    await this.eventsService.assertEventExistsById(id);

    return this.eventsService.favorite({
      eventId: id,
      userId: req.jwtPayload.sub,
    });
  }

  @ApiOkArrayResponse(UserModel)
  @SerializeArray(UserModel)
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
  })
  @Get(':id/participants')
  async getParticipants(
    @Param('id') id: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return mapToArrayResponse(
      await this.eventsService.participants({ id, limit, offset }),
      offset,
    );
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
  @ApiQuery({
    name: 'tags',
    type: 'string',
    isArray: true,
    required: false,
  })
  @Get()
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('order', new ParseEnumPipe(SortOrder, { optional: true }))
    dateOrder?: SortOrder,
    @Query('tags') tags?: string[],
  ) {
    return mapToArrayResponse(
      await this.eventsService.findAll({ limit, offset, dateOrder, tags }),
      offset,
    );
  }

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) data: EventCreateDTO,
    @Req() req: RequestWithJwt,
  ) {
    return this.eventsService.create({
      data: { ...data, authorId: req.jwtPayload.sub },
    });
  }

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @UseGuards(AuthGuard)
  @Post(':id/attend')
  async attend(@Param('id') id: string, @Req() req: RequestWithJwt) {
    return this.eventsService.attend({
      eventId: id,
      userId: req.jwtPayload.sub,
    });
  }

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @UseGuards(AuthGuard)
  @Post(':id/leave')
  async leave(@Param('id') id: string, @Req() req: RequestWithJwt) {
    return this.eventsService.leave({
      eventId: id,
      userId: req.jwtPayload.sub,
    });
  }

  @ApiOkArrayResponse(CommentModel)
  @Get(':id/comments')
  async getCommentsById(@Param('id') id: string) {
    await this.eventsService.assertEventExistsById(id);

    return this.commentsService.findByEventId({ id });
  }

  @ApiOkResponse({ type: CommentModel })
  @Serialize(CommentModel)
  @UseGuards(AuthGuard)
  @Post(':id/comments')
  async createComment(
    @Param('id') id: string,
    @Req() req: RequestWithJwt,
    @Body() data: CommentCreateDTO,
  ) {
    return this.commentsService.create({
      data: {
        ...data,
        userId: req.jwtPayload.sub,
        eventId: id,
      },
    });
  }

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) data: EventUpdateDTO,
    @Req() req: RequestWithJwt,
  ) {
    await this.eventsService.assertCanModifyEvent({
      userId: req.jwtPayload.sub,
      eventId: id,
      role: req.jwtPayload.role,
    });

    return this.eventsService.update({
      id,
      data,
    });
  }
}
