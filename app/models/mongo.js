var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://mongo:27017/userDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "email": String,
    "nome": String,
    "cpf": String,
    "senha": String,
    "role": String
});
module.exports = conn1.model('user', userSchema);
