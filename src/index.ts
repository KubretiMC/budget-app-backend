import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import connectDB from './db/connect';
import { schema } from './schema/schema';

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
