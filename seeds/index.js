const cities = require("./cities")
const {places,descriptors}  = require('./seedHelpers' );
const Campground = require("../models/campground")
const mongoose = require("mongoose")

main().catch((err) => console.log(err))

async function main() {
   await mongoose.connect("mongodb://localhost:27017/yelp-camp")
   console.log("Mongoose connected")
}
const db = mongoose.connection
const sample=array=>array[Math.floor(Math.random()*array.length)]
const seedDB = async () => {
   await Campground.deleteMany({})
   for (let i = 0; i < 50; i++) {
    const rand100=Math.floor(Math.random()*1000);
    const price=Math.floor(Math.random()*30)+20;
    const camp=new Campground({
        author:'636a1e6c945563b6a5a25cb3',
        location:`${cities[rand100].city, cities[rand100].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        image:'https://source.unsplash.com/collection/483251',
        description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. In nulla nihil nobis eos distinctio doloribus cum, quis ut repellat iste. Eos porro ab repellat quis commodi vel suscipit praesentium blanditiis.",
        price
    }) 
    await camp.save();
   }
}

seedDB().then(() => {
    mongoose.connection.close();
})