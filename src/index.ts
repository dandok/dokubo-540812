import { AppDataSource } from './data-source';
import { eventJob } from './cron';
import logger from '../logger';

AppDataSource.initialize()
  .then(() => {
    logger.info('connected to db successfully');
    eventJob.start();
  })
  .catch((e) => {
    logger.info('connection to db failed');
  });
