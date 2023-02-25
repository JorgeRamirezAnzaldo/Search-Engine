//Import express
const express = require('express');
//Import ApolloServer
const { ApolloServer } = require('apollo-server-express');
//Import path
const path = require('path');

//Import typeDefs, resolvers and authorization Middleware
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

//Import database connection
const db = require('./config/connection');

//Define port and make the app use express()
const PORT = process.env.PORT || 3001;
const app = express();

//Create new Apollo server using the typeDefs, resolvers and authorization middleware as context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

//Configure app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//If we are in production, deliver the client/compile as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  })
};

startApolloServer(typeDefs, resolvers);