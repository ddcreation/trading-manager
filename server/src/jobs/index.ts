import * as cron from 'node-cron';
import { ExampleJob } from './example.job';
import { LastDayFallOrderJob } from './last-day-fall-order.job';

export const CronJobs = [
  cron.schedule('* * * * *', ExampleJob, { scheduled: false }),
  cron.schedule('* * * * *', LastDayFallOrderJob, { scheduled: false }),
];
