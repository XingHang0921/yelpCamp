if(process.env.NODE_ENV !== "production"){
    require('dotenv').config({quiet:true});
}


const express = require('express');
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/reviews')
const userRoute = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo').default;
const helmet = require('helmet')
const dbUrl = process.env.DB_URL;
//"mongodb://localhost:27017/yelpCamp"
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error: '))
db.once('open', ()=>{
    console.log('Database connected')
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))


app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const store = MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto:{
        secret: "thisisthetopsecret!",
    }
})

store.on('error', function(e){
    console.log('session store error', e)
})

const sessionConfig = {
    store,
    name:'session',
    secret: "thisisthetopsecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
    "https://github.com/XingHang0921/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives:{
            defaultSrc:[],
            connectSrc:["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc:["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc:["'self'", "blob:"],
            objectSrc:[],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dd9x0c5zo/",
                "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/",
                "https://cdn.worldvectorlogo.com/logos/",
                "https://www.maptiler.com/",
                "https://api.maptiler.com/",
                "https://assets.streamlinehq.com/image/private/",
            ]
        }
    }))

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) =>{
    console.log("locals middleware ran");
    if (!req.session.returnTo) req.session.returnTo = req.originalUrl;
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})



app.use('/', userRoute)
app.use('/campgrounds', campgroundsRoute)
app.use('/campgrounds/:id/reviews', reviewsRoute)

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

app.all(/(.*)/,(req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err
    if(!err.message) err.message = 'oh no, something went wrong'
    res.status(statusCode).render('error',{err})
})

app.listen(3000, ()=>{
    console.log('connect to host 3000')
})
