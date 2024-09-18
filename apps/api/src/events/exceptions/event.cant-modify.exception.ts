import { ForbiddenException } from '@nestjs/common';

export class EventCantModifyException extends ForbiddenException {
  constructor(eventId: string) {
    super(`Event with ID ${eventId} can't be modified.`);
  }
}
