var db = require('mongoose'); 

const userSchema = db.Schema({
    userId: { type : String , unique : true, required : true },
    password: { type : String , required : true },
});

const user = db.model('user', userSchema);

module.exports = user;