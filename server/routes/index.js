var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// POST to register user 
router.post('/register', function(req, res) {
    var addUser = new req.user({
        userId: req.body.user.userId,
        password: req.body.user.password,
    });

    //add new user document
    addUser.save(function (err, result) {
        console.log(err);
        if (err === null) {
            res.send("");
        } else {
            res.send(err);
        }
    });
});

// POST to register user 
router.post('/login', function(req, res) {
    let result = req.user.findOne( { 
        "userId": req.body.user.userId, 
        "password": req.body.user.password 
    }, function(err, docs) {
        if (err === null) {
            if (docs) {
                req.session.user = docs;
            }
            res.send(docs);
        }
        else
            res.send(docs);
      });
});

// GET session cart and rest the current session cart to empty, send it to user who logged in
router.get('/sessionCart', function(req, res) {
    if (req.session.cart) {
        let temp = req.session.cart;
        req.session.cart = '';
        res.send(temp);
    }
    else {
        res.send("");
    }
});

// GET login
router.get('/currentUser', function(req, res) {
    if (req.session.user) {
        const data = {
            logged_in: true,
            user: req.session.user,
        };
        res.status(200).send(data);
    } else {
        const data = {
            logged_in: false,
        };
        res.status(200).send(data);
    }
});

router.get('/allUser', function(req, res) {
    req.user.find(function(err, docs) {
        if (err === null) {
            res.send(docs);
        }
        else
            res.send({ msg: err });
    }); 
});


// GET logout
router.get('/logout', function(req, res) {
    req.session.destroy();
});

module.exports = router;
