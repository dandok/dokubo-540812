import { EventEmitter } from 'events';
import { handleToken } from './service/token.service';

const eventEmitter = new EventEmitter();
eventEmitter.on('message', (data) => handleToken(data));

export { eventEmitter };
