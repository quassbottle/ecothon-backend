import { Global, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { init } from '@paralleldrive/cuid2';

@Global()
@Module({
  providers: [
    AnalyticsService,
    {
      provide: 'ANALYTICS_ID',
      useValue: init({ length: 32 }),
    },
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
