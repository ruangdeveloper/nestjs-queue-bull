import { HttpService } from "@nestjs/axios";
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
@Processor('network-request-queue')
export class AppConsumer {
    constructor(
        private readonly httpService: HttpService,
    ) { }

    @Process()
    async process(job: Job<{ url: string }>) {
        Logger.log(`Processing job ${job.id}`);
        Logger.log(job.data);
        const { data } = await firstValueFrom(this.httpService.get(job.data.url).pipe(
            catchError((error) => {
                Logger.error(error);
                throw error;
            })
        ));

        return data;
    }

    @OnQueueActive()
    onActive(job: Job) {
        Logger.log(`Processing job ${job.id} of type ${job.name}`);
    }

    @OnQueueCompleted()
    onCompleted(job: Job, result: any) {
        Logger.log(`Completed job ${job.id} of type ${job.name}`);
        Logger.log(result);
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        Logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`);
    }
}