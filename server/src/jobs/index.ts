import * as cron from 'node-cron';
import { ExampleJob } from './example.job';

export const CronJobs = [
  cron.schedule('* * * * *', ExampleJob, { scheduled: false }),
];
