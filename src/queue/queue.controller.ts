import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('email')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Post('welcome')
  async sendWelcome(@Body('email') email: string) {
    await this.queueService.sendWelcomeEmail(email);
    return { message: 'Email job added to the queue!' };
  }
}
