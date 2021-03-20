import Event from '../../models/event.js';
import { transformEvent } from './merge.js'


const eventResolver = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map((event) => {
          return transformEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },
    createEvent: async (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date().toISOString(),
        creator: '6051488249f83442340c84ef',
      });
      let createdEvent;
      try {
        const result = await event.save();
        createdEvent = transformEvent(result);
        const creator = await User.findById('6051488249f83442340c84ef');
  
        if (!creator) {
          throw new Error('User Not Found');
        }
        creator.createdEvents.push(event);
        await creator.save();
        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  };

  export default eventResolver;