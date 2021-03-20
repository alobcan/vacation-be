import authResolver from './auth.js';
import eventResolver from './events.js';
import bookingResolver from './booking.js';

const rootResolver = {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver,
};

export default rootResolver;
