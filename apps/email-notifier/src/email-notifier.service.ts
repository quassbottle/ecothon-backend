import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailNotifierService {
  getHello(): string {
    return 'Hello World!';
  }
}
