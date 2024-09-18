import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): unknown;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export function SerializeArray(dto: ClassConstructor) {
  return UseInterceptors(new SerializeArrayInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ClassConstructor) => {
        return plainToInstance(this.dto, data, {});
      }),
    );
  }
}

export class SerializeArrayInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ClassConstructor) => {
        const instance: unknown & { data?: unknown[] } = plainToInstance(
          this.dto,
          data,
          {},
        );

        if (!instance.hasOwnProperty('data')) {
          throw new InternalServerErrorException(
            'Invalid serialization params',
          );
        }

        return {
          ...data,
          data: instance.data.map((item) => {
            return plainToInstance(this.dto, item, {});
          }),
        };
      }),
    );
  }
}
