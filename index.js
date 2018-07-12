'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { graphql, buildSchema } = require('graphql');

const PORT = process.env.PORT || 3000;
const server = express();
const schema = buildSchema(`
type Video {
    id: ID,
    title: String,
    duration: Int,
    watched: Boolean
}

type Query {
    video: Video
    videos: [Video]
}

type schema {
    query: Query
}
`);

const videoA = {
    id: 91,
    title: 'video A',
    duration: 31,
    watched: true
};
const videoB = {
    id: 92,
    title: 'video B',
    duration: 32,
    watched: false
};

const videos = [videoA, videoB];

const resolvers =  {
    videos: () => videos,
    video: () => ({
        id: 1,
        title: 'bar',
        duration: 13,
        watched: true    
    })
};

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    rootValue: resolvers
}));

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
})
