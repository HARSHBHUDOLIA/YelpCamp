const express = require("express")
const methodOverride = require("method-override")
const flash = require('connect-flash');
const app = express()
const port = 3000
const path = require("path")
const Joi = require('joi');
const {campgroundSchema,reviewSchema} = require('./schemas');
const Campground = require("./models/campground");
const Review = require("./models/review")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const session=require('express-session')
const campgrounds=require("./routes/campground")
const reviews=require("./routes/review")

const ExpressError=require("./utils/ExpressError");

main().catch(err => console.log(err));
async function main() {
   await mongoose.connect("mongodb://localhost:27017/yelp-camp")
   console.log("Mongoose connected")
}




app.get("/", (req, res) => {
   res.render("home")
})

app.engine("ejs", ejsMate)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
