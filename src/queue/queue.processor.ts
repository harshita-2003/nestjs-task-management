import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';

@Processor('email')
export class QueueProcessor extends WorkerHost {
  async process(job) {
    console.log(`Processing job: ${job.name}`, job.data);

    if (job.name === 'send-welcome') {
      console.log(`Sending welcome email to ${job.data.email}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job) {
    console.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job, err) {
    console.error(`Job ${job.id} failed: ${err.message}`);
  }
}
