const {
    nodeDefinitions,
    fromGlobalId
} = require('graphql-relay');
const { getObjectById } = require('./data');

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        const { type, id } = fromGlobalId(globalId);
        return getObjectById(type.toLowerCase(), id);
    },
    (object) => {
        const { videoType, countryType } = require('./schema');
        if(object.title) {
            return videoType;
        }
        if(object.alpha2_code) {
            return countryType;
        }

        return null;
    }
);

exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;