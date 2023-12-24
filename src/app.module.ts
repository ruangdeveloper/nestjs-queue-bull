import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { HttpModule } from '@nestjs/axios';
import { AppConsumer } from './app.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name: 'network-request-queue',
    }),
    BullBoardModule.forRoot({
      route: '/queue-monitor',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      {
        name: 'network-request-queue',
        adapter: BullAdapter,
      }
    ),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConsumer],
})
export class AppModule { }
