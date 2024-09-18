import { Module, DynamicModule, Global } from '@nestjs/common';
import { LeakyBucketService } from './leaky-bucket.service';
import { RateLimiterModuleParams } from './types/module.types';

@Global()
@Module({})
export class RateLimiterModule {
  static forRoot(params: RateLimiterModuleParams): DynamicModule {
    return {
      module: RateLimiterModule,
      providers: [
        {
          provide: 'RATE_LIMIT_CONFIG',
          useValue: params,
        },
        LeakyBucketService,
      ],
      exports: [LeakyBucketService],
    };
  }
}
