import { MoreThan } from 'typeorm';
import { AppDataSource } from '../data-source';
import { ActivityEntity } from '../model/activity';
import { TokenEntity } from '../model/token';
import { IToken, IContractIndex } from '../@types/interface';
import logger from '../../logger';

export async function handleToken(activities: ActivityEntity[]) {
  logger.info('handling token');

  const contractIndexes = activities.map((activity) => {
    return {
      contract_address: activity.contract_address,
      index: activity.token_index,
    };
  });

  const uniqueTokens = await getUniquePairs(contractIndexes);
  const existingTokens = await getTokens(uniqueTokens);
  const activeListings = await fetchActiveListings(uniqueTokens);
  const newTokeArr: IToken[] = [];

  uniqueTokens.forEach((token) => {
    const key = `${token.contract_address}-${token.index}`;
    const tokenActiveListings = activeListings[key];
    let minimumPrice = null;

    if (tokenActiveListings && tokenActiveListings.length > 0) {
      minimumPrice = Math.min(
        ...tokenActiveListings.map((listing) => listing.listing_price),
      );
    }

    const newToken: IToken = {
      contract_address: token.contract_address,
      index: token.index,
      current_price: minimumPrice,
    };

    const existingToken = existingTokens?.get(key);
    if (existingToken) {
      newToken.id = existingToken.id;
    }
    newTokeArr.push(newToken);
  });

  await processTokens(newTokeArr);
}

async function processTokens(tokenArr: any[]) {
  try {
    const tokenRepository = AppDataSource.getRepository(TokenEntity);
    await tokenRepository.upsert(tokenArr, ['id']);
  } catch (error) {
    logger.error('failed to save tokens', error);
    throw new Error('failed to save tokens');
  }
}

async function fetchActiveListings(uniqueTokens: IContractIndex[]) {
  logger.info('fetching active listings');

  const timeStampNow = Math.floor(Date.now() / 1000);
  const activityWhereQuery = uniqueTokens.map((token) => {
    return {
      contract_address: token.contract_address,
      token_index: token.index,
      listing_to: MoreThan(timeStampNow),
    };
  });

  const activityRepository = AppDataSource.getRepository(ActivityEntity);
  const activeActivities = await activityRepository.find({
    where: activityWhereQuery,
  });

  const groupedActivities: Record<string, ActivityEntity[]> = {};
  activeActivities.forEach((activity) => {
    const key = `${activity.contract_address}-${activity.token_index}`;
    if (groupedActivities[key]) {
      groupedActivities[key].push(activity);
    } else {
      groupedActivities[key] = [activity];
    }
  });

  return groupedActivities;
}

async function getUniquePairs(objects: IContractIndex[]) {
  logger.info('fetching unique pairs');

  const map = new Map();
  objects.forEach((obj) => {
    const key = `${obj.contract_address}-${obj.index}`;
    map.set(key, obj);
  });

  return Array.from(map.values()) as IContractIndex[];
}

export async function getTokens(uniquePairs: IContractIndex[]) {
  logger.info('fetching tokens');

  try {
    const tokenRepository = AppDataSource.getRepository(TokenEntity);
    const tokens = await tokenRepository.find({ where: uniquePairs });
    const mappedTokens = new Map<string, TokenEntity>();
    tokens.forEach((token) => {
      const key = `${token.contract_address}-${token.index}`;
      mappedTokens.set(key, token);
    });

    return mappedTokens;
  } catch (error) {
    logger.error('failed to fetch tokens', error);
    throw new Error('failed to fetch tokens');
  }
}
