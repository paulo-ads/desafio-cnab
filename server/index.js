/*Imports e configurações iniciais*/

require('dotenv').config(); //No caso especial desse projeto, o arquivo .env ficará disponível para facilitar o acesso à aplicação
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { authRouter } = require('./routes/auth.js'); //Router para acesso às endpoints de autorização e autenticação

const app = express();

const porta = process.env.PORTA_API || 3001; //Servidor abrirá na porta referida no .env OU na 3001.

app.use(cors());
app.use(express.json());
app.use("", authRouter);

/*Rota Pública voltada a testes de conexão*/
app.get('/' , (req, res) => {
    res.status(200).json({ msg: 'Você está conectado!' })
})

/*Configurações do banco de dados (aqui referido como database)*/
const dbUser = process.env.DB_USER; // Usuário cuja database receberá as informações. Por padrão, se conectará à minha.
const dbSenha = process.env.DB_SENHA // Senha da minha database, será trocada depois do projeto ser avaliado.

/*Configuração de conexão com a database. O servidor express só inicia se a conexão com a database for estabelecida*/
mongoose.connect(`mongodb+srv://${dbUser}:${dbSenha}@mern-app.kucrhd2.mongodb.net/desafio-cnab?retryWrites=true&w=majority`).then(() => { //Ao conectar com uma nova database, a chave deve ser substituida (e as chaves de usuario e senha, também)
    console.log("MongoDB: Conexão estabelecida!")
    app.listen(porta, () => {
        console.log(`Express: Servidor rodando na porta ${porta}`)
    })
}).catch((err) => console.log(err))