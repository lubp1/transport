var mongoose = require("mongoose");
conn1 = mongoose.createConnection('mongodb://mongo:27017/passagemDB', {useNewUrlParser: true});
var Schema = mongoose.Schema;
var passagemSchema = new Schema({
    "partida": String,
    "destino": String,
    "horario": String,
    "assento": Number,
    "cpf": String
});
module.exports = conn1.model('passagem', passagemSchema);
