import express from 'express';
import graphqlHttp from 'express-graphql';
import buildSchema from 'graphql';

const app = express();

const { buildSchm } = buildSchema;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchm(`
      type RootQuery{
        events: [String!]!
      }

      type RootMutation {
        createEvent(name: String): String
      }
        
      schema {
        query:
        mutation:
      }
    `),
    rootValue: {
      events: () => {
        return ['All night coding', 'React Tutorial', 'meh'];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
