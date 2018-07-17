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
const {
    globalIdField,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionArgs,
    mutationWithClientMutationId
} = require('graphql-relay')
const { nodeInterface, nodeField } = require('./src/node')

const PORT = process.env.PORT || 3000;
const server = express();

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'The video Type description',
    fields: {
        id: globalIdField(),
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
    interfaces: [nodeInterface]
});
exports.videoType = videoType;

const {connectionType: VideoConnection } = connectionDefinitions({
    nodeType: videoType,
    connectionFields: () => ({
        totalCount: {
            type: GraphQLInt,
            description: 'A count of total objects in this connection',
            resolve: (conn) => {
                return conn.edges.length;
            }
        }
    })
})

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query Type',
    fields : {
        node: nodeField,
        videos: {
            type: VideoConnection,
            args: connectionArgs,
            resolve: (_, args) => connectionFromPromisedArray(
                getVideos(),
                args
            )
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

const videoMutation = mutationWithClientMutationId({
    name: 'AddVideo',
    inputFields: {
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
    },
    outputFields: {
        video: {
            type: videoType
        }

    },
    mutateAndGetPayload: (args) => new Promise((resolve, reject) => {
        Promise.resolve(createVideo(args))
            .then((video) => resolve ({ video }))
            .catch(reject);
    })
})

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type',
    fields: {
        createVideo: videoMutation
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
