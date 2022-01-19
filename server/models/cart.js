var db = require('mongoose'); 

const cartSchema = db.Schema({
    musicId: { type : String , required : true },
    musicName: { type : String , required : true },
    musicImage: { type : String , required : true },
    musicPrice: { type : Number , required : true },
    userId: { type : String , required : true },
    quantity: { type : Number , required : true },
});

const cart = db.model('cart', cartSchema);

module.exports = cart;