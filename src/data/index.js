const { groupKTService } = require('../common/groupKTService');

const videoA = {
    id: '1',
    title: 'video A',
    duration: 31,
    watched: true
};
const videoB = {
    id: '2',
    title: 'video B',
    duration: 32,
    watched: false
};

const videos = [videoA, videoB];

const getVideoById = (id) => new Promise((resolve) =>{
    const [video] = videos.filter((video) => {
        return video.id === id;
    });

    resolve(video);
});

const getVideos = () => new Promise((resolve) => resolve(videos));

const createVideo = ({ title, duration, watched }) => {
    const video = {
        id: (new Buffer(title, 'utf8').toString('base64')),
        title,
        duration,
        watched
    };

    videos.push(video);

    return video;
};

const getObjectById = (type, id) => {
    const types = {
        video: getVideoById,
        country: getCountryById,
    };

    return types[type](id);
};

const getCountries = () => new Promise((resolve) => {
    resolve(groupKTService.getAllCountries());
});

const getCountryById = (id) => new Promise((resolve) =>{
    getCountries().then((countries) => {
        const [country] = countries.filter((country) => {
            return country.id === id.toLowerCase();
        });
        resolve(country);
    })
    
});

exports.getCountries = getCountries;
exports.getCountryById = getCountryById;
exports.getVideoById = getVideoById;
exports.getVideos = getVideos;
exports.createVideo = createVideo;
exports.getObjectById = getObjectById;