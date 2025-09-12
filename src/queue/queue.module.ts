import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService, QueueProcessor],
})
export class QueueModule {}