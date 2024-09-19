import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req, Res,
  UseGuards,
  ValidationPipe
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { format } from 'fast-csv';
import { EventUpdateDTO } from './dto/event-update.dto';
import { AuthGuard, HasTokenGuard } from '../auth/auth.guard';
import { RequestWithJwt } from '../auth/auth.types';
import { CommentsService } from '../comments/comments.service';
import { CommentCreateDTO } from '../comments/dto/comment-create.dto';
import { CommentModel } from '../comments/models/comment.model';
import { UserModel } from '../user/models/user.model';
import { EventCreateDTO } from './dto/event-create.dto';
import { EventModel } from './models/event.model';
import { createObjectCsvWriter } from 'csv-writer';
import {
  ApiOkArrayResponse,
  mapToArrayResponse,
  Serialize,
  SerializeArray,
  SortOrder,
} from '@app/common';
import { Roles } from '../auth/role.decorator';
import { AnalyticsModel } from '../analytics/models/analytics.model';
import { EventsService } from './events.service';
import * as fs from "fs";
import * as moment from 'moment';

export enum EventsFilter {
  FAVORITE = 'favorite',
  ATTENDING = 'attending',
}

@ApiBearerAuth('jwt')
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly eventsService: EventsService,
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
  @UseGuards(AuthGuard)
  @Roles('host', 'admin')
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
  @ApiQuery({
    name: 'end',
    type: 'date',
    required: false,
  })
  @ApiQuery({
    name: 'start',
    type: 'date',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    enum: ['favorite', 'attending'],
    required: false,
  })
  @ApiQuery({
    name: 'radius',
    required: false,
  })
  @ApiQuery({
    name: 'latitude',
    required: false,
  })
  @ApiQuery({
    name: 'longitude',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    required: false,
  })
  @UseGuards(HasTokenGuard)
  @Get()
  async findAll(
    @Req() req: RequestWithJwt,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('order', new ParseEnumPipe(SortOrder, { optional: true }))
    dateOrder?: SortOrder,
    @Query('tags') tags?: string[],
    @Query('start') start?: Date,
    @Query('end') end?: Date,
    @Query('radius', new ParseFloatPipe({ optional: true })) radius?: number,
    @Query('latitude', new ParseFloatPipe({ optional: true }))
    latitude?: number,
    @Query('longitude', new ParseFloatPipe({ optional: true }))
    longitude?: number,
    @Query('type', new ParseEnumPipe(EventsFilter, { optional: true }))
    type?: EventsFilter,
  ) {
    return mapToArrayResponse(
      await this.eventsService.findAll({
        limit,
        offset,
        dateOrder,
        tags,
        start,
        end,
        type,
        latitude,
        longitude,
        radius,
        userId: req.jwtPayload?.sub ?? undefined,
      }),
      offset,
    );
  }

  @ApiOkResponse({ type: EventModel })
  @Serialize(EventModel)
  @UseGuards(AuthGuard)
  @Roles('host', 'admin')
  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) data: EventCreateDTO,
    @Req() req: RequestWithJwt,
  ) {
    return this.eventsService.create({
      data: {
        ...data,
        bannerUrl: data.bannerUrl,
        authorId: req.jwtPayload.sub,
      },
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
  @Roles('host', 'admin')
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

  @ApiOkResponse({ type: AnalyticsModel })
  @ApiQuery({
    name: 'end',
    type: 'date',
    required: false,
  })
  @ApiQuery({
    name: 'start',
    type: 'date',
    required: false,
  })
  @Serialize(AnalyticsModel)
  @UseGuards(AuthGuard)
  @Roles('host', 'admin')
  @Get(':id/analytics')
  async analytics(
    @Param('id') id: string,
    @Req() req: RequestWithJwt,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    await this.eventsService.assertCanModifyEvent({
      userId: req.jwtPayload.sub,
      eventId: id,
      role: req.jwtPayload.role,
    });
    return this.eventsService.analytics({
      eventId: id,
      period: {
        start: start ? new Date(start) : new Date(),
        end: end
          ? new Date(end)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  @ApiOkResponse({ type: AnalyticsModel })
  @ApiQuery({
    name: 'end',
    type: 'date',
    required: false,
  })
  @ApiQuery({
    name: 'start',
    type: 'date',
    required: false,
  })
  @Serialize(AnalyticsModel)
  @UseGuards(AuthGuard)
  @Roles('host', 'admin')
  @Get(':id/analytics/download')
  async analyticsDownload (
    @Param('id') id: string,
    @Res() res: any,
    @Req() req: RequestWithJwt,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    await this.eventsService.assertCanModifyEvent({
      userId: req.jwtPayload.sub,
      eventId: id,
      role: req.jwtPayload.role,
    });
    const candidate = await this.eventsService.analytics({
      eventId: id,
      period: {
        start: start ? new Date(start) : new Date(),
        end: end
          ? new Date(end)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const ws = fs.createWriteStream('./output.csv', { flags: 'w' });

    format({ headers: false })
      .transform((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
      }))
      .pipe(ws);

    ws.write(`A,B\n`);
    ws.write(`За всё время,Количество\n`);
    ws.write(`Мужчины,${candidate.data.total.gender.male}\n`);
    ws.write(`Женщины,${candidate.data.total.gender.female}\n`);
    ws.write(`Неизвестно,${candidate.data.total.gender.unknown}\n`);
    ws.write(`Сумма,${candidate.data.total.gender.total}\n`);
    ws.write(`,\n`);
    const formattedDateStart = `${candidate.period.start.getDate()}-${candidate.period.start.getMonth() + 1}-${candidate.period.start.getFullYear()}`;
    const formattedDateEnd = `${candidate.period.end.getDate()}-${candidate.period.end.getMonth() + 1}-${candidate.period.end.getFullYear()}`;
    ws.write(
      `События за период от ${formattedDateStart} до ${formattedDateEnd},\n`,
    );
    ws.write(`Комменатрии,${candidate.data.period.comments}\n`);
    ws.write(`Добавили в избранное,${candidate.data.period.favorite}\n`);
    ws.write(`Убрали из избранного,${candidate.data.period.unfavorite}\n`);
    ws.write(`Решили участвовать,${candidate.data.period.attend}\n`);
    ws.write(`Отказались от участия,${candidate.data.period.unattend}\n`);

    ws.end();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

    res.sendFile('./output.csv', { root: process.cwd() });
  }
}
