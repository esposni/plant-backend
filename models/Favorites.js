/** @constructor
* @augments FavoriteSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Favorites = exports.Favorites=  new Schema({
    user : {type: String, default:"anon"},
    dataURL : {type: String, required: true},
    name:{type: String, required: true,default:""},
    bookmarked:{type: Boolean, required: true,default:false},
    links: {type: Object, default: {}},
    dateCreated:{type: Date, required: true, default: Date.now}
});

mongoose.model("Favorites",Favorites);