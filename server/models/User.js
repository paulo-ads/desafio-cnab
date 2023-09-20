/*Modelo utilizado para criação do usuário*/
const mongoose = require('mongoose');

/* Criação do Schema do usuário, que guardará suas informações pessoais;
Uma vez criado o modelo das operações, o usuário guardará também os id's das operações por ele criadas */
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("users", UserSchema);
module.exports = User;