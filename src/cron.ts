import { CronJob } from 'cron';
import { fetchEvents } from './service/activity.service';

export const eventJob = new CronJob('* * * * *', fetchEvents);
