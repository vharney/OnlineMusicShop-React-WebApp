var db = require('mongoose'); 

const musicSchema = db.Schema({
    name: { type : String , unique : true, required : true },
    category: { type : String , required : true },
    composer: { type : String , required : true },
    description: { type : String , required : true },
    price: { type : Number , required : true },
    published: { type : String , required : true },
    newArrival: { type : String , required : true },
    image: { type : String , required : true },
    mp3: { type : String , required : true },
    // image: { base64: String, imageFormat: String},
    // mp3: Buffer,
});

const music = db.model('music', musicSchema);

module.exports = music;