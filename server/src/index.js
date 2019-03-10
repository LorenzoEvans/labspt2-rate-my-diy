const {GraphQLServer} = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client/');
 const Mutation = require('./resolvers/Mutation');
 const Query = require('./resolvers/Query');
 const User = require('./resolvers/User');

 const resolvers = {
   Query,
   Mutation,
 }

 
 const options = {
   port: 4466,
   endpoint: 'https://us1.prisma.sh/lorenzo-evans-e9af31/server/dev'
  }
  
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma },
    introspection: true,
    playground: true
});

server.start(options, ({ port }) => 
  console.log(`🚀 Server ready at ${port}`)
);