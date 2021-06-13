require('dotenv').config()
const express = require('express')
const app = express() 
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT= process.eventNames.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session) 
const passport = require('passport')
const { use } = require('passport')

//Database connection
const url = 'mongodb+srv://pranjal:pranjal@ecom.okykr.mongodb.net/pizza';

mongoose.connect(url, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true });
const connection = mongoose.connection;

connection.once('open', () => {

    console.log('Database connected');

}).catch(err => {

    console.log('Connection failed...')
});

//session store
let mongoStore = new MongoDbStore ({
    mongooseConnection: connection,
    collection: 'sessions'
})

//Session config
app.use(session ({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24} //24 hours
}))

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Global middleware
app.use((req,res,next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//Assets
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

require('./routes/web') (app)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})