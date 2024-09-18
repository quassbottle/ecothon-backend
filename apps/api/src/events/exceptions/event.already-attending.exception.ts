import { BadRequestException } from '@nestjs/common';

export class AlreadyAttendingEventException extends BadRequestException {
  constructor() {
    super('User is already attending this event');
  }
}
