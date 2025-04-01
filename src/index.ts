import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import connectDB from './db/connect';
import { schema } from './schema/schema';
import { defineAssociations } from './models/associations';

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(() => {
  defineAssociations();
  app.use(
    '/graphql',
    graphqlHTTP((req) => ({
      schema,
      graphiql: process.env.NODE_ENV !== 'production',
      context: { request: req },
    }))
  );

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log('process.env.NODE_ENV2222', process.env.NODE_ENV);
    console.log(`Server running on http://localhost:${PORT}/graphql`);
  });
});
