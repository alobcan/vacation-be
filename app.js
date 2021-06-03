import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import rootResolver from './graphql/resolvers/index.js';
import schema from './graphql/schema/index.js';
import isAuth from './middleware/is-auth.js'

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
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
    app.listen(8000);
  })
  .catch((err) => {
    console.log(process.env.MONGO_URL);
    console.log(err);
  });
