import { BadRequestException } from '@nestjs/common';

export class NotAttendingEventException extends BadRequestException {
  constructor() {
    super('User is not attending this event');
  }
}
