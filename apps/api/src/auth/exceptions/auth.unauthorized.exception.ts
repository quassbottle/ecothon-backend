import { UnauthorizedException } from '@nestjs/common';

export class JwtUnauthorizedException extends UnauthorizedException {
  constructor() {
    super('Unauthorized');
  }
}
