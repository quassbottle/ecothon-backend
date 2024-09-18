import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithJwt } from './auth.types';
import { AuthService } from './auth.service';
import { JwtUnauthorizedException } from './exceptions/auth.unauthorized.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: RequestWithJwt): Promise<boolean> {
    const authorization = request.headers['authorization'];

    try {
      if (!authorization) {
        throw new JwtUnauthorizedException();
      }

      const payload = await this.authService.verify({
        token: this.extractTokenFromHeader(request as unknown as Request),
      });

      if (!payload) {
        throw new JwtUnauthorizedException();
      }

      request.jwtPayload = payload;
    } catch (e) {
      throw new JwtUnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (
        request.headers as unknown as Request & {
          headers: { authorization?: string };
        }
      )['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
