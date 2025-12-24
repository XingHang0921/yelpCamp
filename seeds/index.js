const mongoose = require('mongoose')
const Campground = require('../models/campGround')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelpCamp')

const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error: '))
db.once('open', ()=>{
    console.log('Database connected')
})
const sample =(array)=> array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i ++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
          //PC:69063c000c437e705db13737
          //laptop:69038dbc5e11e46ef0db581d
          author: "69063c000c437e705db13737",
          title: `${sample(descriptors)} ${sample(places)}`,
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ],
          },
          images: [
            {
              url: "https://res.cloudinary.com/dd9x0c5zo/image/upload/v1764365361/YelpCamp/khtijklgbccacve9o5tg.png",
              filename: "YelpCamp/khtijklgbccacve9o5tg",
            },
            {
              url: "https://res.cloudinary.com/dd9x0c5zo/image/upload/v1764365363/YelpCamp/qiwyzh8kfo0bauiwhki5.png",
              filename: "YelpCamp/qiwyzh8kfo0bauiwhki5",
            },
            {
              url: "https://res.cloudinary.com/dd9x0c5zo/image/upload/v1764365365/YelpCamp/tb2chraveyfvse8az1bu.png",
              filename: "YelpCamp/tb2chraveyfvse8az1bu",
            },
          ],
          description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure aliquid officiis asperiores numquam esse architecto ipsum natus! Neque illum ea nihil debitis delectus corrupti, modi quas, voluptatem rerum in excepturi?",
          price,
        });
        await camp.save();
    }
    console.log('seeeding complete')
}

seedDB().then(() =>{
    mongoose.connection.close();
});