const express = require('express');

const router = express.Router();

const valuesPost = require('../models/valuesPost');


// Routes
router.get('/', (req, res) => {

    valuesPost.find({  })
        .then((data) => {
            // console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', daerrorta);
        });
});

router.post('/save', (req, res) => {
    const data = req.body;

    const newValuesPost = new valuesPost(data);
    valuesPost.remove({  }).then((data) => {
        newValuesPost.save((error) => {
            if (error) {
                res.status(500).json({ msg: 'Sorry, internal server errors' });
                return;
            }
            
            return res.json({
                msg: 'Your data has been saved!!!!!!'
            });
        });
    })
    .catch((error) => {
        console.log('error: ', daerrorta);
    });
    
    
});

router.delete('/delete', (req, res) => {
    valuesPost.remove({  })
    .then((data) => {
        // console.log('Remove: ', data);
        res.json({
            msg: "Remove"
        });
    })
    .catch((error) => {
        console.log('error: ', daerrorta);
    });
});



module.exports = router;