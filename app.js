if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

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

const passport=require('passport')
const ExpressError=require("./utils/ExpressError");
const LocalStrategy=require("passport-local");
const User = require("./models/user");
main().catch(err => console.log(err));
async function main() {
   await mongoose.connect("mongodb://localhost:27017/yelp-camp")
   console.log("Mongoose connected")
}


//Routes
const campgroundRoutes=require("./routes/campground")
const reviewRoutes=require("./routes/review");
const userRoutes=require("./routes/user");

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
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req,session);
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//Routes
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/',userRoutes)

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
