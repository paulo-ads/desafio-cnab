/* Middleware de autorização para proteger os endpoints de requisições não-autorizadas */
const jwt = require('jsonwebtoken');

/*O middleware busca o token de acesso na header de autorização da requisição*/
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

// Sem o token de acesso, a requisição é rejeitada.
    if(!token) return res.status(401).json({ msg: "Acesso negado." })

    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret) //Chave secret, usada no processo de criptografar o token, é usada para checar autenticidade do token
        next()
    } catch(err){
        res.status(400).json({ msg: "Token inválido." })
    }
}

module.exports = checkToken;