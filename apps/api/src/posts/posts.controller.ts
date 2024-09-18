import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { PostModel } from './models/post.model';
import { PostCreateDTO } from './dto/post-create.dto';
import { PostUpdateDTO } from './dto/post-update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithJwt } from '../auth/auth.types';
import { Roles } from '../auth/role.decorator';
import { RoleGuard } from '../auth/role.guard';
import { Serialize, ApiOkArrayResponse, mapToArrayResponse } from '@app/common';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOkResponse({ type: PostModel })
  @Serialize(PostModel)
  @Get(':id')
  async getById(@Param('id') id: string) {
    await this.postsService.assertPostExistsById(id);

    return this.postsService.findById({ id });
  }

  @ApiOkArrayResponse(PostModel)
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
  })
  @Get()
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return mapToArrayResponse(
      await this.postsService.findAll({ limit, offset }),
      offset,
    );
  }

  @ApiOkResponse({ type: PostModel })
  @Serialize(PostModel)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  async create(@Body() data: PostCreateDTO, @Req() req: RequestWithJwt) {
    return this.postsService.create({
      data: { ...data, authorId: req.jwtPayload.sub },
    });
  }

  @ApiOkResponse({ type: PostModel })
  @Serialize(PostModel)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Patch(':id')
  async patch(@Body() data: PostUpdateDTO, @Param('id') id: string) {
    return this.postsService.update({ id, data });
  }
}
