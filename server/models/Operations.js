/*Modelo utilizado para criação da operação*/
const mongoose = require('mongoose');

/* Criação do Schema da operação, que guardará informações sobre cada operação salva;
As operações também guardam os id's dos usuários que as criaram */
const OperationsSchema = new mongoose.Schema({
    erro: { type: Boolean, required: true },
    tipo: { type: String, required: true },
    data: { type: String, required: true },
    valor: { type: String, required: true },
    cpf: { type: String, required: true },
    cartao: { type: String, required: true },
    nomeDono: { type: String, required: true },
    nomeLoja: { type: String, required: true },
    userCreator: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
});

const Operations = mongoose.model("operations", OperationsSchema);
module.exports = Operations;