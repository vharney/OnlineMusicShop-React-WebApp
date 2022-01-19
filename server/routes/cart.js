var express = require('express');
const { reset } = require('nodemon');
var router = express.Router();
var cartSchema = require('../models/cart')

// GET all cart of the current user  
router.get('/', function(req, res) {
    // console.log(req.session);
    // If logged in, find from db
    if (req.session.user) {
        console.log("HADWAWDAW");
        req.cart.find( { "userId": req.session.user.userId }, function(err, docs) {
            if (err === null) {
                res.send(docs);
            }
            else
                res.send({ msg: err });
        }); 
    }  
    else { // send from session
        res.send(req.session.cart);
        // res.send(req.session.cart);
    }
});

// POST to add cart 
router.post('/addCart', async (req, res) => {
    // console.log(req);
    var addCart = new cartSchema(req.body.purchase);

    // console.log(addCart);
    // add new user document
    if (req.session.user) {
        addCart.userId = req.session.user.userId
        req.session.cart = '';

        // req.session.cart.findOneAndUpdate( {
        //     "musicId": addCart.musicId ,
        //     "userId": req.session.user.userId
        // }, (err, docs) => {})
        try {
            await req.cart.findOne( {
                "musicId": addCart.musicId ,
                "userId": req.session.user.userId
            }, async (err, docs) => {
                if (err === null) {
                    if (docs) {
                        // If not empty, means found
                        // console.log("ADAWDAWDAWDAW");
                        // console.log(docs);
                        // await req.cart.findByIdAndUpdate(docs._id, { quantity: docs.quantity + addCart.quantity }, { new: true }, function (err, docs) {
                        //     if (err == null)
                        //         res.send("")
                        //     else
                        //         res.send(err)
                        // });
                        docs.quantity += addCart.quantity;
                        docs.save((err, result) => {
                            res.send(!err?{msg:""}:{msg:err});
                        });
                        // req.session.cart = '';
                        // res.send({msg: ""});
                        // return;
                    }
                    else {
                        await addCart.save(function (err, result) {
                            console.log(err);
                            if (err === null) {
                                res.send("");
                            } else {
                                res.send(err);
                            }
                        });
                    }
                }
                else
                    res.send(err);
            });
        }
        catch {
            console.log("ERRORR")
            req.session.cart = '';
            // res.send({msg: ""});
            return;
        }
    }
    else {
        if (!req.session.cart) {
            let temp = [];
            temp.push(addCart);
            req.session.cart = temp;
        }
        else {
            let anyMatch = false;
            for (let x of req.session.cart) {
                if (x.musicId === addCart.musicId) {
                    x.quantity = x.quantity + addCart.quantity;
                    anyMatch = true;
                    break;
                }
            }
            if (!anyMatch) {
                req.session.cart.push(addCart);
            }
        }
        res.send("");
    }
});

// Clear all items in cart 
router.delete('/clearCart', function(req, res) {
    if (req.session.user) {
        req.cart.deleteMany({userId:req.session.user.userId}, function(err, docs) {
            res.send((err==null) ? { msg: "" } : { msg: err });
        })
    }
    else {
        console.log("After delete");
        req.session.cart = "";
        console.log(req.session);
        res.send("");
    }
}) 

/*
* DELETE to delete an item in the cart
*/
router.delete('/deleteCart/:id', function(req, res) {
    var id = req.params.id;
    
    if (req.session.user) {
        req.cart.findByIdAndDelete(id, function (err, docs) {
            res.send((err==null) ? { msg: "" } : { msg: err });
        });
    }
    else {
        // for (let x of req.session.cart) {

        // }
        let temp = [];
        console.log("HERE")
        // req.session.cart = req.session.cart.filter(function( obj ) {
        //     return obj.musicId !== id;
        // });

        for (let x of req.session.cart) {
            if (x._id !== id) {
                temp.push(x);
            }
        }
        req.session.cart = temp;
        console.log(req.session);
        res.send("");
    }
});

module.exports = router;