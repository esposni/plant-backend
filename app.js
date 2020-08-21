const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const dust = require('klei-dust');
//Mongoose is a module used to connect to MongoDB.
const mongoose = require('mongoose');
const config = require('./config');


// mongod --config /usr/local/etc/mongod.conf
mongoose.connect(process.env.MONGODB_URI||(config.mongoUrl+config.mongoDbName),{useNewUrlParser: true , useUnifiedTopology: true});
//configure app
app.use(logger('dev')); 

dust.setOptions({useHelpers: true});
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.engine('dust', dust.dust);

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// Initialize routers here
const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/', routers.favorites);
app.use('/bookmarked', routers.bookmarked);

module.exports = app;