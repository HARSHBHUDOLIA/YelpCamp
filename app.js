const express = require("express")
const methodOverride = require('method-override');

const app = express()
const port = 3000
const path = require("path")
const Campground = require("./models/campground")
const mongoose = require("mongoose");
const ejsMate=require("ejs-mate")
const { urlencoded } = require("express")

main().catch((err) => console.log(err))

async function main() {
   await mongoose.connect("mongodb://localhost:27017/yelp-camp")
   console.log("Mongoose connected")
}
const db = mongoose.connection

app.get("/", (req, res) => {
   res.render("home")
})
app.engine('ejs',ejsMate)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride('_method'))
app.get("/campgrounds", async (req, res) => {
   const campgrounds = await Campground.find({})
   res.render("campgrounds/index", { campgrounds })
})
//To send the Post request for new campground
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

//To add a new campground
app.get("/campgrounds/new", async (req, res) => {
  
  res.render("campgrounds/new")
})


//To Edit the Form
app.get('/campgrounds/:id/edit', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  console.log("Hi I am here")
  res.render("campgrounds/edit", { campground });
})

//Send the PUT request to edit the form
app.put("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},{new:true})
  
  res.redirect(`/campgrounds/${campground._id}`)
})




//To know details of an existing campground
app.get("/campgrounds/:id", async (req, res) => {
   const campground = await Campground.findById(req.params.id)
   
   res.render("campgrounds/show", { campground })
})

//To delete a campground
app.delete('/campgrounds/:id',async(req,res)=>{
  const {id}=req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})


app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
})
