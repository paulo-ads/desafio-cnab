/*Modelo utilizado para criação do usuário*/
const mongoose = require('mongoose');

/* Criação do Schema do usuário, que guardará suas informações pessoais;
Os usuários também guardam os id's das operações por eles criadas */
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedOperations: [{ type: mongoose.Schema.Types.ObjectId, ref: "operations" }],
});

const User = mongoose.model("users", UserSchema);
module.exports = User;