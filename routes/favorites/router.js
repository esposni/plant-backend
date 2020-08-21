/** @module favorites/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config= require('../../config');

//model Object
require('../../models/Favorites');
const Favorites = mongoose.model('Favorites');

router.get('/:userid?/favorites', function(req, res) {
    const userid = req.params.userid || "anon";
    Favorites.find({user: userid}, function(err, found){
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
            let F = [];
            let map={};
            found.forEach(function(el){
                map._id=el._id;
                map.name=el.name;
                map.dataURL= el.dataURL;
                map.bookmarked=el.bookmarked;
                map.dateCreated=el.dateCreated;
                map.links={
                    "self": config.url + "/favorites/" + el._id
                }
                F.push(map);
            });
            res.json(F);
        }
    });
    
});

router.get('/:userid?/favorites/search', function(req, res) {
    const userid = req.params.userid || "anon";
    let qname = req.query.name;
    let id = req.query._id;
    console.log('query name',qname);
    console.log('query id',id);
	if (id && qname) {
        Favorites.findById(id,function(err, found) {
            if (err) {
                res.status(404).end('Not Found');
            } 
            else if(found.user==userid && found.name==qname){
                if (req.accepts("html")){
                    let string="";
                    found.forEach(function(el){
                        string+='<img src="'+el.dataURL+'" />';
                    });
                    res.send(string);
                }else{
                    res.status('201').type('application/json').json(found);
                }
                
            }else{
                res.status(404).end('Not Found');
            }
        });
	} else if (qname) {
        Favorites.find({name: qname},function(err, found) {
            if (err) {
                res.status(404).end('Not Found');
            } 
            else if(found.user==userid){
                if (req.accepts("html")){
                    let string="";
                    found.forEach(function(el){
                        string+='<img src="'+el.dataURL+'" />';
                    });
                    res.send(string);
                }else{
                    res.status('201').type('application/json').json(found);
                }
            }else{
                res.status(404).end('Not Found');
            }
        });
	} else if (id) {
		Favorites.findById(id,function(err, found) {
            if (err) {
                res.status(404).end('Not Found');
            } 
            else if(found.user==userid){
                if (req.accepts("html")){
                    res.send('<img src="'+found.dataURL+'" />');
                }else{
                    res.status('201').type('application/json').json(found);
                }
            }else{
                res.status(404).end('Not Found');
            }
        });
    }else{
        res.end();
    }
});

//:id handler here
router.get('/:userid?/favorites/:favoriteid', function(req, res) {
    const userid = req.params.userid || "anon";
    const id = req.params.favoriteid;
    Favorites.findById(id,function(err, found) {
        if (err) {
             //object did not exist before
             res.status(404).end('Not Found');
        } 
        else if (found === null) {
            res.status(404).end('Not Found');
        }
        else if(found.user==userid){
            if (req.accepts('html')) {
                res.send('<img src="'+found.dataURL+'" />');
            }else {
                found.links={
                    "self" : config.url + "/favorites/" + found._id
                };
                //console.log(found.links);
                res.json(found);
            }
        }
        else{
            res.status(404).end('Not Found');
        }
    });
});

//Allows to bookmark an existing favorite
router.put('/:userid?/favorites/:favoriteid/bookmarked',function(req,res){
    const userid = req.params.userid || "anon";
    const id = req.params.favoriteid;
    Favorites.findById(id,function(err, found) {
        if (err) {
             //object did not exist before
            //Creating a model instance
            res.status(404).end();
        }else if (found === null) {
            res.status(404).end('Not Found');
        }
        else if(found.user==userid){
            //object already exists (replace content)
            //Only modify the object ields if the request body contains replacement values
            if (req.body.bookmarked) {
                found.bookmarked = req.body.bookmarked;
            }
            found.save(function(err, saved) {
                if (req.accepts('html')) {
                    res.redirect('/');   
                } else {
                    res.status('201').type('application/json').json(saved);
                }
            });
        }else{
            const newFav= new Favorites({user:qname});
            newFav.save(function(err, saved) {
                res.json(saved);
            });
        }
    });

});

router.put('/:userid?/favorites/:favoriteid', function(req, res) {
    const userid = req.params.userid || "anon";
    const id = req.params.favoriteid;
    Favorites.findById(id,function(err, found) {
        if (err) {
            //object did not exist before
           //Creating a model instance
           res.status(404).end();
       }else if (found === null) {
           res.status(404).end('Not Found');
       }
       else if(found.user==userid){
           //object already exists (replace content)
           //Only modify the object ields if the request body contains replacement values
           if (req.body.name) {
               found.name = req.body.name;
           }
           found.save(function(err, saved) {
               if (req.accepts('html')) {
                   res.redirect('/');   
               } else {
                   res.status('201').type('application/json').json(saved);
               }
           });
       }else{
           const newFav= new Favorites({user:qname});
           newFav.save(function(err, saved) {
               res.json(saved);
           });
       }
    });
});

router.post('/:userid?/favorites/', (req, res) => {
    const userid = req.params.userid || "anon";
	if ((req.is('application/json') 
			|| req.is('application/x-www-form-urlencoded'))
			&& req.body.name
			&& req.body.dataURL) 
	{
		const myFav = new Favorites({ 
            user:userid,
            name: req.body.name,
            dataURL: req.body.dataURL,
            bookmarked:req.body.bookmarked,
            dateCreated: new Date()
        });
		
        myFav.save(function(err,saved){
            if (err){
                console.log(err);
                res.status(500).end();
            }
            
            if (req.accepts('html')) {
                res.redirect('/');   
            } else {
                res.status('201').type('application/json').json(saved);
            }
        });
        
	} else {
		res.status(400);
		res.end('Bad Request');
	}
});

//add DELETE /:id handler here (Task 10)

router.delete('/:userid?/favorites/:favoriteid', function(req, res, next) {
    const id = req.params.favoriteid;
    const userid = req.params.userid || "anon";
    
    Favorites.findById(id, function(err, found) {
        if(err){
            res.status(404).end();
        }
        else if (found === null) {
            res.status(404).end('Not Found');
        }
        else if(found.user==userid){
            found.remove(function(err, removed) {
                if(err){
                    res.status(500).end();
                }else{
                    if (req.accepts('html')) {
                        res.redirect('/');   
                    } else {
                        res.status('201').type('application/json').json(removed);
                    }
                }
            });
        }else{
            res.status(404).end();
        }
    });
    
});

module.exports = router;