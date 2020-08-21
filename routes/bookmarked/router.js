/** @module bookmarked/router */
'use strict';

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
require('../../models/Favorites');
const Favorites = mongoose.model('Favorites');

router.get('/', (req, res) => {

	Favorites.find({bookmarked:true}, function(err, found){
        if (err) {
            res.status(500).end();
            return;
        }
        if (req.accepts("html")){
            let string="";
            found.forEach(function(el){
                string+='<img src="'+el.dataURL+'" />';
            });
            res.send(string);
        } else {
            res.json(found);
        }
    });
});

/** router for /root */
module.exports = router;