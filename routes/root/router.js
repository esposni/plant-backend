/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../../models/Favorites');
var Favorites = mongoose.model('Favorites');
var usr;
//display the page in view folder
router.get('/', function(req, res) {
    Favorites.find({}, function(err, found) {
        if(err){ 
            res.status(500).end();
        }
        if (req.accepts("html")){
            res.render('index',{favorites: found,usr_val:usr}); 
        } else {
            res.json(found);
        }
    });
});

router.post('/', function(req, res) {
    usr=req.body.usr;
    res.redirect('/');
});

/** router for /root */
module.exports = router;
