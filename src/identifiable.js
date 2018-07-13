const {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');
const videoType = require('../')

const identifiable = new GraphQLInterfaceType({
    name: 'Identifiable',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: 'the id of the video'
        },
    },
    resolve: (object) => {
        if(object.title) {
            return videoType;
        }
        return null;
    }
});

module.exports = identifiable;