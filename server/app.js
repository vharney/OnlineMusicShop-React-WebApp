var express = require('express');
var cors = require('cors');
const path = require("path");
var db = require('mongoose'); 
var session = require('express-session');

// Database connection
const CONNECTION_URL = "mongodb+srv://vieri:comp3322project@comp3322-project.qmywv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5001;
db.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log("MongoDB connection error: " + error.message));


var app = express();

var user = require('./models/user');
var music = require('./models/music');
var cart = require('./models/cart');


app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(cors(
    {credentials: true, 
         origin: 
        [
        'http://localhost:3001',
        ],}
));

app.use(
    session({ 
        secret: 'something',
        saveUninitialized: true,
        resave: true,
        cookie: {
            httpOnly: false,
            // sameSite: 'none',
            maxAge: 3600000,
        } 
    })
);

app.use( function(req,res, next) {
    console.log("IN APP JS");
    // res.header('Access-Control-Allow-Origin', "http://localhost:3001");
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    console.log(req.session);
    next();
});

app.use(function(req, res, next) {
    req.user = user;
    next(); 
});

app.use(function(req, res, next) {
    req.music = music;
    next(); 
});

app.use(function(req, res, next) {
    req.cart = cart;
    next(); 
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

var indexRouter = require('./routes/index');
app.use('/', indexRouter)

var musicRouter = require('./routes/music');
app.use('/music', musicRouter);

var cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);