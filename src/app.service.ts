import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('network-request-queue')
    private readonly networkRequestQueue: Queue,
  ) { }

  async addNetworkRequestJob(data: { url: string }) {
    await this.networkRequestQueue.add(data);
  }
}
