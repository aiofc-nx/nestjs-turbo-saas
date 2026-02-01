import momentDefault from 'moment';
import 'moment-timezone';
import { extendMoment } from 'moment-range';

export const moment = extendMoment(momentDefault as any);
