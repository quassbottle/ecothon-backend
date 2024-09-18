import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentModel } from './models/comment.model';
import { CommentUpdateDTO } from './dto/comment-update.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithJwt } from '../auth/auth.types';
import { Serialize } from '@app/common';

@ApiBearerAuth('jwt')
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOkResponse({ type: CommentModel })
  @Serialize(CommentModel)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: RequestWithJwt) {
    await this.commentsService.assertCanModifyComment({
      userId: req.jwtPayload.sub,
      commentId: id,
      role: req.jwtPayload.role,
    });

    return this.commentsService.delete({ id });
  }

  @ApiOkResponse({ type: CommentModel })
  @Serialize(CommentModel)
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() req: RequestWithJwt,
    @Body() data: CommentUpdateDTO,
  ) {
    await this.commentsService.assertCanModifyComment({
      userId: req.jwtPayload.sub,
      commentId: id,
      role: req.jwtPayload.role,
    });

    return this.commentsService.update({ id, data });
  }
}
