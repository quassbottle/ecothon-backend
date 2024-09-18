import { BadRequestException } from '@nestjs/common';

export class UserOtherUpdateException extends BadRequestException {
  constructor() {
    super('Вы не можете менять чужую аватарку');
  }
}
