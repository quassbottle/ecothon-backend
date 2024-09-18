import { NotFoundException } from '@nestjs/common';

export class FileNotFoundExceptionDto extends NotFoundException {
  constructor() {
    super('Файл не найден в системе');
  }
}
