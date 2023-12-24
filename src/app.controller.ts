import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/add-job')
  async addJob(
    @Body() data: { url: string },
  ) {
    await this.appService.addNetworkRequestJob({
      url: data.url,
    });

    return {
      message: 'Job added',
    };
  }
}
