import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

const events = [];

app.use(express.json());

const schema = buildSchema(`
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
}

type RootQuery{
  events: [Event!]!
}

type RootMutation {
  createEvent(eventInput: EventInput): Event
}
  
schema {
  query: RootQuery
  mutation: RootMutation
}
`);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);
