const path = require('path'); 
const express = require('express'); 
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const methodOverride = require('method-override'); 
const passport = require('passport'); 
const mongoose = require('mongoose'); 
const session = require('express-session')
const app = express(); 

/** PASSPORT BASIC */
// passport.use(require('./src/auth/basic')); 
// app.get('*', passport.authenticate('basic', {session: false})); 

require('./src/auth/local')(passport)
require('dotenv-safe').config()

app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 
app.use(methodOverride('_method')); 
app.use(session({
    secret: '!#$#$#$&$O#YUO#I$U', 
    resave: false, 
    saveUninitialized: true}))
app.use(passport.initialize()); 
app.use(passport.session())
app.set('view engine', 'pug'); 
app.set('views', path.join(__dirname, 'src/view')); 

require('./src/index')(app, passport); 

mongoose.connect(process.env.MONGO_CONN, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}); 

mongoose.Promise = global.Promise; 

app.listen(3000, () => {
    console.log('Express has been starter'); 
}); 