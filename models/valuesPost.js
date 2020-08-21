const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const valuesPostSchema = new Schema({
    temperature: String,
    humidity: String,
    luminosity: String,
    date: {
        type: String,
        default: Date.now()
    }
});

// Model
const valuesPost = mongoose.model('valuesPost', valuesPostSchema);

module.exports =  valuesPost;