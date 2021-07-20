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
const Emitter = require('events')

//Database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true });
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

//Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

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
    if(req.user)
        res.locals.role=req.user.role
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
app.use( (req,res) => {
    res.status(404).render('errors/404')
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

//Socket

const io = require('socket.io')(server)

io.on('connection', (socket) => {
    // Join connected client
    socket.on('join', (orderId) => {
        socket.join(orderId)
        
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to(`adminRoom`).emit('orderPlaced', data)
})