import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(PostId: string) {
    super(`Post with ID ${PostId} not found.`);
  }
}
