'use strincs';

const axios = require('axios');
const cachios = require('cachios');

axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['charset'] = 'utf-8';

const axiosGroupKTServiceInstance = axios.create({
    baseURL: 'http://services.groupkt.com/country/',
})

const cachiosInstance = cachios.create(axiosGroupKTServiceInstance);

const groupKTService = {
 getAllCountries: () => cachiosInstance.get('get/all', {
    ttl: 30 /* 30 seconds cache */
    }).then(response => {
        var countries = [];
        response.data.RestResponse.result.forEach(country => {
            country.id = country.name.toLowerCase();
            countries.push(country);
        });
        return countries;
    })
    .catch(error => {
        console.log(error);
    }),
}

exports.groupKTService = groupKTService;