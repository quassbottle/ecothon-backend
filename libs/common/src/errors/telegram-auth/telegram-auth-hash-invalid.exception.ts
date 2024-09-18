import { NotFoundException } from '@nestjs/common';

export class TelegramAuthHashInvalidException extends NotFoundException {
  constructor() {
    super('Пользователя с таким telegram нет в системе');
  }
}
