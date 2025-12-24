if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({quiet:true});
}

const maptilerClient = require('@maptiler/client')
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY
async function findCoordinates(){
    const geoData = await maptilerClient.geocoding.forward('Los Angles');
    console.log(geoData.features[0])
}
findCoordinates();