import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export function Roles(...roles: Role[]) {
  return SetMetadata('roles', roles);
}
