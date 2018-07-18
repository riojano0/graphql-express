'use strict';

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql');
const {
    globalIdField,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionArgs,
    mutationWithClientMutationId
} = require('graphql-relay')
const { createVideo, getVideoById, getVideos, getCountries, getCountryById } = require('./data');
const { nodeInterface, nodeField } = require('./node')

const countryType = new GraphQLObjectType({
    name: 'Country',
    description: 'The country Type description',
    fields: {
        id: globalIdField('Country'),
        name: {
            type: GraphQLString,
            description: 'The name of the country'
        },
        alpha2_code: {
            type: GraphQLString,
            description: 'The alpha code 2 of the country'
        },
        alpha3_code: {
            type: GraphQLString,
            description: 'The alpha code 3 of the country'
        },
    },
    interfaces: [nodeInterface]
})
exports.countryType = countryType;

const {connectionType: CountryConnection } = connectionDefinitions({
    nodeType: countryType,
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
        countries: {
            type: CountryConnection,
            args: connectionArgs,
            resolve: (_, args) => connectionFromPromisedArray(
                getCountries(),
                args
            )
        },
        country: {
            type: countryType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'the id for search is the name of the country',
                }
            },
            resolve: (_, args) => { return getCountryById(args.id); }
        },
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
            resolve: (_, args) => {
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

exports.schema= schema;