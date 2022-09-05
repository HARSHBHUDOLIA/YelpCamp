const express = require('express')
const app = express()
const port = 3000
const path=require('path')
const Campground=require('./models/campground')
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('Mongoose connected');
}
const db=mongoose.connection;

app.get('/', (req, res) => {
  res.render('home')
})

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/makecampground',async(req,res)=>{
const camp =new Campground
})