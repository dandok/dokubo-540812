import axios from 'axios';
import { eventEmitter } from '../emitter';
import { ActivityEntity } from '../model/activity';
import { AppDataSource } from '../data-source';
import logger from '../../logger';

export async function fetchEvents() {
  logger.info('Fetching events');

  const endTimeStamp = Math.floor(Date.now() / 1000);
  const startTimeStamp = endTimeStamp - 60;

  let continuation = null;
  let eventsArr = [] as any[];

  do {
    const { events, continuation: cont } = await fetchData(
      startTimeStamp,
      endTimeStamp,
      continuation
    );

    eventsArr = eventsArr.concat(events);
    continuation = cont;
  } while (continuation);

  const filteredEvents = eventsArr.filter((e) => e.event.kind == 'new-order');

  try {
    const processedevents = buildDto(filteredEvents);
    await insertActivityToDb(processedevents);

    eventEmitter.emit('message', processedevents);
  } catch (error) {
    logger.error('failed to fetch events', error);
    throw new Error('error occured while fetching events');
  }
}

async function fetchData(
  startTimeStamp: number,
  endTimeStamp: number,
  continuation: string | null = null
) {
  logger.info('Fetching data');

  const eventsUrl = 'https://api.reservoir.tools/events/asks/v3?limit=1000';
  const url = new URL(eventsUrl);
  url.searchParams.append('startTimestamp', startTimeStamp.toString());
  url.searchParams.append('endTimestamp', endTimeStamp.toString());

  if (continuation) url.searchParams.append('continuation', continuation);

  try {
    const { data } = await axios.get(url.toString());
    logger.info('Fetched data successfully');

    return data;
  } catch (error) {
    logger.error('failed to fetch data', error);
    throw new Error('error occured while fetching data from API');
  }
}

function buildDto(events: any[]) {
  logger.info('building dto');

  return events.map((e) => {
    return {
      contract_address: e.order.contract,
      token_index: e.order.criteria.data.token.tokenId,
      listing_price: e.order.price.amount.native,
      maker: e.order.maker,
      listing_from: e.order.validFrom,
      listing_to: e.order.validUntil,
      event_timestamp: e.event.createdAt,
    };
  });
}

async function insertActivityToDb(filteredEvents: any[]) {
  logger.info('inserting activity to database');

  try {
    const activityRepository = AppDataSource.getRepository(ActivityEntity);
    await activityRepository.insert(filteredEvents);
  } catch (error) {
    logger.error('failed to insert data to db', error);
    throw new Error('error occured while inserting data to db');
  }
}
