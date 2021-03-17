import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Event from './models/event.js';
import User from './models/user.js';

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

type User {
  _id: ID!
  email: String!
  password: String
}

input EventInput {
  title: String!
  description: String!
  price: Float!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery{
  events: [Event!]!
}

type RootMutation {
  createEvent(eventInput: EventInput): Event
  createUser(userInput: UserInput): User
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
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date().toISOString(),
          creator: '6051488249f83442340c84ef'
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = {...result._doc, _id: result.id}
            return User.findById('6051488249f83442340c84ef');
          })
          .then(user => {
            if (!user) {
              throw new Error('User Not Found');
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error('User Exists Already');
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, _id: result.id };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.ludkn.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(process.env.MONGO_URL);
    console.log(err);
  });
