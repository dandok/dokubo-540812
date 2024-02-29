import { createLogger, format, transports } from 'winston';

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
);

const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logfile.log', level: 'info' }),
  ],
});

export default logger;
