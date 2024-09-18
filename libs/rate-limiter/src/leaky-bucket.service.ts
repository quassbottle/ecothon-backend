import { Inject, Injectable, Scope } from '@nestjs/common';

import { LeakyBucketQueue } from './core/leaky-bucket.queue';
import { RateLimiterModuleParams } from './types/module.types';
import { Action } from './types/leaky-bucket.types';

@Injectable({ scope: Scope.DEFAULT })
export class LeakyBucketService {
  private readonly leakyBucketQueue: LeakyBucketQueue;

  constructor(@Inject('RATE_LIMIT_CONFIG') config: RateLimiterModuleParams) {
    this.leakyBucketQueue = new LeakyBucketQueue(
      config.requestsPerSecond ?? 30,
    );
  }

  async executeWithArgs<T, A extends Array<unknown>>(
    action: Action<T, A>,
    ...args: A
  ): Promise<[Error | null, T | null]> {
    return this.leakyBucketQueue.execute(action, ...args);
  }

  async execute<T>(
    action: (...args: Array<unknown>) => T,
  ): Promise<[Error | null, T | null]> {
    return this.leakyBucketQueue.execute(action);
  }
}
