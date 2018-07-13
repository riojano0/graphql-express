'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql');

const { createVideo, getVideoById, getVideos } = require('./src/data');
const identifiable = require('./src/identifiable')

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'The video Type description',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'the id of the video'
        },
        title: {
            type: GraphQLString,
            description: 'the title of the video'
        },
        duration: {
            type: GraphQLInt,
            description: 'the duration on minutes of the video'
        },
        watched: {
            type: GraphQLBoolean,
            description: 'The video was watched or not'
        }
    },
    interfaces: [identifiable]
});

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query Type',
    fields : {
        videos: {
            type: new GraphQLList(videoType),
            resolve: getVideos
        },
        video: {
            type: videoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'the id of the video',
                }
            },
            resolve: (_, args) =>  {
                return getVideoById(args.id);
            }
        }
    }
});

const videoInputType = new GraphQLInputObjectType({
    name: 'videoInput',
    fields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'the title of the video'
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'the duration on minutes of the video'
        },
        watched: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The video was watched or not'
        }
    }
});

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type',
    fields: {
        createVideo: {
            type: videoType,
            args: {
                video: {
                    type: new GraphQLNonNull(videoInputType)
                }
            },
            resolve: (_, args) => { return createVideo(args.video); }
        }
    }

});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
});

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
})
