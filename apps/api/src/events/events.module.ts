import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { init } from '@paralleldrive/cuid2';
import { CommentsModule } from '../comments/comments.module';
import { UserModule } from '../user/user.module';
import { EventsNotifierSchedule } from './events.schedule';
import { TagsModule } from '../tags/tags.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    EventsNotifierSchedule,
    EventsService,
    {
      provide: 'EVENT_ID',
      useValue: init({ length: 16 }),
    },
  ],
  controllers: [EventsController],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CommentsModule),
    TagsModule,
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            name: 'EVENTS_NOTIFIER',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'app-gateway',
                brokers: [config.get<string>('KAFKA_ENDPOINT')],
              },
              producerOnlyMode: true,
            },
          }),
          name: 'EVENTS_NOTIFIER',
        },
      ],
    }),
  ],
  exports: [EventsService],
})
export class EventsModule {}
