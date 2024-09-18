import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RequestWithJwt } from './auth.types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) return true;

    const { jwtPayload } = context
      .switchToHttp()
      .getRequest() as RequestWithJwt;

    return required.some((role) => jwtPayload.role?.includes(role));
  }
}
