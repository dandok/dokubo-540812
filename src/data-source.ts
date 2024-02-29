import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ActivityEntity } from './model/activity';
import { TokenEntity } from './model/token';



export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, //for purpose of testing only, in real scenario this should be turned off and migrations should be used instead
  entities: [ActivityEntity, TokenEntity],
  // migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
});
