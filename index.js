'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const server = express();
const { schema } = require('./src/schema');
const PORT = process.env.PORT || 3000;

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
})
