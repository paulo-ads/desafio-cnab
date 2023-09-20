/*Rotas gerais relacionadas à autenticação e autorização*/

const express = require('express');
const bcrypt = require('bcrypt'); // Utilizado para criptografar a senha do usuário no banco de dados
const jwt = require('jsonwebtoken'); // Utilizado para gerenciar se o usuário está logado ou não
const checkToken = require('../middlewares/checkToken'); // Middleware de autorização para proteger os endpoints de requisições não-autorizadas
const User = require('../models/User'); // Modelo/Classe utilizado/a para criação de novos usuários

const router = express.Router();


/*Rota pública de registro, que receberá um objeto com o nome, email, senha e confirmação de senha;

No estágio inicial, ele realiza a averiguação da presença das informações e se o usuário já existe*/
router.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    if(!name) return res.status(422).json({ msg: "O nome de usuário é um campo obrigatório." })
    if(!email) return res.status(422).json({ msg: "O email é um campo obrigatório." })
    if(!password) return res.status(422).json({ msg: "A senha é um campo obrigatório." })
    if(password !== confirmpassword) return res.status(422).json({ msg: "As senhas inseridas não coincidem." })

    const userExists = await User.findOne({ email: email })
    if(userExists) return res.status(422).json({ msg: "Esse email já está cadastrado. Por favor, utilize outro email." })

// Depois, ele usa o bcrypt para criptografar a senha e transforma-la em hash
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

// Finalmente, o novo usuário é criado ao enviar as informações tratadas para o modelo
    const user = new User({
        name,
        email,
        password: passwordHash,
    })
    try{
        await user.save()
        res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch(err){
        res.status(500).json({ msg: "Algo deu errado... Tente novamente mais tarde." })
    }
});

/*Rota pública de Login, que receberá um objeto com email e senha

No estágio inicial, é realizada a verificação se todos os campos necessários foram enviados e se o usuário enviado existe no banco de dados;
Também é comparada a senha enviada com a senha (hash) salva no banco de dados*/
router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body

    if(!email) return res.status(422).json({ msg: "O email é um campo obrigatório." })
    if(!password) return res.status(422).json({ msg: "A senha é um campo obrigatório." })

    const user = await User.findOne({ email: email })
    if(!user) return res.status(404).json({ msg: "Usuário não encontrado." })

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) return res.status(422).json({ msg: "Senha inválida." })

// Se tudo correr bem, ele gera um token de acesso através da chave secret e o react-cookies o acopla na sessão
    try{
        const secret = process.env.SECRET
        const token = jwt.sign({ id: user._id }, secret)
        res.status(200).json({ msg: 'Autenticação realizada com sucesso.', token, userID: user._id })
        
    } catch(err){
        res.status(500).json({ msg: "Algo deu errado... Tente novamente mais tarde." })
    }
})

module.exports = { authRouter: router, };
