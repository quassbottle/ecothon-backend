import { ForbiddenException } from '@nestjs/common';

export class CommentCantModifyException extends ForbiddenException {
  constructor(commentId: string) {
    super(`Comment with ID ${commentId} can't be modified.`);
  }
}
