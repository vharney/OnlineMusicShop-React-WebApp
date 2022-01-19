var express = require('express');
var router = express.Router();
var musicSchema = require('../models/music')


// POST to add music 
router.post('/addMusic', function(req, res) {
    var addMusic = new musicSchema(req.body);
    
    console.log(addMusic);
    //add new user document
    addMusic.save(function (err, result) {
        console.log(err);
        if (err === null) {
            res.send("");
        } else {
            res.send(err);
        }
    });
});

// GET all music 
router.get('/', function(req, res) {
    console.log(req.session)
    req.music.find(function(err, docs) {
        if (err === null) {
            res.send(docs);            
        }
        else
            res.send({ msg: err });
      }); 
    // res.json(musicList);
});

// GET unique category of music
router.get('/uniqueCategory', function(req, res) {
    req.music.distinct("category", function(err, docs) {
        if (err === null) {
            res.json(docs);
        }
        else
            res.send({ msg: err });
      }); 
    // res.json(musicList);
});

module.exports = router;