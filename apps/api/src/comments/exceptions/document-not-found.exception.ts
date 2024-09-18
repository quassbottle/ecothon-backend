import { NotFoundException } from '@nestjs/common';

export class DocumentNotFoundException extends NotFoundException {
  constructor() {
    super('Данного документа нету в системе');
  }
}
