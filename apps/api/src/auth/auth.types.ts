import { $Enums } from '@prisma/client';
import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  exp: number;
  role: $Enums.Role;
};

export type RequestWithJwt = Request & { jwtPayload: JwtPayload };
