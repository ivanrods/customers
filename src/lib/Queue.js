import Bee from "bee-queue";
import DummyJob from "../app/jobs/DummyJob";
import redisConfig from "../config/redis";
import WellcomeEmailJob from "../app/jobs/WellcomeEmailJob";

const jobs = [DummyJob, WellcomeEmailJob];
class Queue {
    constructor() {
        this.queues = {};
        this.init();
    }
    init() {
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }
    add(queue, job){
        return this.queues[queue].bee.createJob(job).save()
    }
    processQueue(){
        jobs.forEach(job => {
            const {bee, handle} = this.queues[job.key]

            bee.on('failid', this.handleFailure).process(handle)
        })
    }
    handleFailure(job, err){
        console.error(`Queue ${job.queue.name}: FAILED`, err)
    }
}
export default new Queue();
