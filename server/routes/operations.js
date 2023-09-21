/*Rotas especializadas voltadas a lidar com as operações CNAB*/

const express = require('express');
const Operations = require('../models/Operations'); // Modelo/Classe utilizado/a para salvar operações carregadas por usuários
const User = require('../models/User'); // Modelo/Classe utilizado/a para criação de novos usuários
const CNAB = require('../modules/classes/Cnab'); // Módulo que, através de um construtor, converte strings de dados brutos em objetos CNAB
const fs = require('fs'); // Módulo usado para ler os arquivos temporários que serão carregados
const path = require('path'); // Módulo que dinamiza o processo de escrever caminhos (paths)

const organizaDados = require('../modules/organizaDados') // Módulo que organiza os dados retirados dos arquivos temporários
const checkToken = require('../middlewares/checkToken'); // Middleware de autorização para proteger os endpoints de requisições não-autorizadas
const enviaFile = require('../middlewares/multer'); //Middleware de configuração do Multer, que permite o carregamento de arquivos temporários

/*Configuração do Multer*/
var multer = enviaFile(multer);
const { upload, destination } = multer; // Upload carrega informações sobre como salvar o arquivo carregado. Destination é o caminho onde ele será temporariamente mantido. 

const router = express.Router();

/*Rota privada que retorna todas as operações salvas no banco de dados*/
router.get('/', checkToken, async (req, res) => {
    try{
        const response = await Operations.find({});
        res.json(response);
    } catch (err){
        console.log(err)
        res.send(500).json({ msg: 'Erro: operações não puderam ser resgatadas' });
    }
});

/*Rota privada que recebe um array de objetos, onde cada objeto possuí as chaves necessárias para criar uma nova operação na database;

É realizada uma iteração pelo array e cada objeto (operação) é salvo*/
router.post('/upload/save', checkToken, async (req, res) => {
    const operationsArray = req.body;
    const operationsID = [];
  
    try {
        await Promise.all(operationsArray.map(async (operation) => {
            const operationDB = new Operations(operation);
            const response = await operationDB.save();
            operationsID.push(response._id.toString()); // O ID de cada objeto, retornado após manda-lo para o Model, é inserido em um array 
        }));
        res.json(operationsID); // Envia o array com ID's como resposta
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro: dados não foram salvos' });
    }
  });
  
/*Rota privada que registra uma operação como criada por um usuário;

A requisição é composta pelo ID do usuário e o ID da requisição que ele criou*/
router.put('/upload/register', checkToken, async (req, res) => {
    try{
        const operation = await Operations.findById(req.body.operationID); // Verifica se o ID da operação recebido está no banco de dados
        const user = await User.findById(req.body.userID); // Verifica se o ID de usuário recebido está no banco de dados
        user.savedOperations.push(operation); // Manda o ID da operação para o campo "savedOperations" do banco de dados do usuário
        await user.save();
        res.json({ savedOperations: user.savedOperations });
    } catch (err){
        console.error(err);
        res.status(500).json({ msg: 'Erro: dados não foram registrados' });
    }
});

/*Rota Privada que recebe um ID de usuário e retorna os ID's das operações criadas por este*/
router.get('/saved/ids', checkToken, async (req, res) => {
    try{
        const user = await User.findById(req.body.userID);
        res.json({ savedOperations: user?.savedOperations }) // Retorna os ID's das operações criadas pelo usuário do ID da requisição, SE ele tiver criado alguma.
    } catch(err){
        console.error(err)
        res.status(500).json({ msg: 'Erro: operações não foram resgatadas' })
    }
})

/*Rota privada que recebe um ID de usuário e retorna as operações criadas por ele como objetos (não apenas o ID, mas todo o corpo da operação)*/
router.get('/saved', checkToken, async (req, res) => {
    try{
        const { userID } = req.query;
        const user = await User.findById(userID);
        const savedOperations = await Operations.find({ //Após verificar o usuário do ID recebido, a rota busca por operações salvas cujo os ID's estão inclusos nos ID's das operações criadas pelo usuário.
            _id: { $in: user.savedOperations },
         });
        res.json({ savedOperations }) //Retorna um array de objetos
    } catch(err){
        console.error(err)
        res.send(500).json({ msg: 'Erro: objetos das operações não foram resgatados' });
    }
})

/*Rota privada onde os arquivos carregados são enviados;

Recebe o arquivo (que deve ser enviado com a key 'file' no form) e o salva temporariamente (por padrão, na pasta Uploads)*/
router.post('/upload', checkToken, upload.single('file'), async (req, res) => {
    const filePath = path.resolve(__dirname, `../${destination}/${req.file.originalname}`);

    try {
        if(req.file.originalname.slice(-3) == "txt") res.json(req.file); //Camada extra de verificação do formato do arquivo (deve ser .txt)
        else fs.unlink(filePath, (err) => { // Se o arquivo enviado não fôr .txt, ele é imediatamente excluído.
            if (err) {
                console.error(err);
            } else {
                console.log(`Deleted file: ${filePath}`);
                res.status(400).json({ msg: 'Arquivo não-txt enviado' }) 
            }
          });        
    }catch(err) {
        console.error(err)
        res.send(400).json({ msg: 'Erro: arquivo não foi salvo' });
    }
})

/*Rota privada que recebe um nome de arquivo e, através da chave destination (retirada do middleware do Multer) e do módulo fs, lê as informações do arquivo e as envia de volta;*/
router.get('/upload/read', checkToken, async (req, res) => {
    try {
        const { filename } = req.query;
        const filePath = path.resolve(__dirname, `../${destination}`, filename); // Utiliza o módulo path para recolher o atual diretório, depois o destination para verificar o destino dos arquivos temporarios
      
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8'); // Lê e retorna o conteúdo do arquivo cujo nome foi recebido
            res.json({ fileContent }); 
      } else {
            res.status(404).json({ msg: 'Erro: Arquivo não encontrado' });
      }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Erro: arquivo não encontrado ou não pôde ser lido' });
    }
  });

/*Rota privada que recebe o conteúdo de um arquivo (idealmente no formato CNAB) e retorna um array de arrays*/
router.post('/upload/parse', checkToken, async(req, res) => {
    try{
        const fileContent = req.body.params.fileContent;
        const arrays = organizaDados(fileContent); //O módulo 'organizaDados' é responsável por receber uma string e devolver uma matriz (array de arrays), onde cada array era uma linha da string
        const parsedOperations = arrays.map((array) => new CNAB(array)); //Cada array da matriz passa pelo construtor da classe CNAB, resultando em objetos. O array de objetos é salvo na variavel
        res.json(parsedOperations);
    } catch(err){
        console.error(err);
        res.status(500).json({ msg: 'Erro: arquivo não foi parseado' });
    }
})

/*Rota privada que deleta arquivos txt salvos na pasta destination;
A pasta para deletar os arquivos não vai na requisição por questões de segurança, por padrão, é a pasta Uploads (salva na variavel destination)*/
router.delete('/upload/clear', checkToken, (req, res) => {
    const folderPath = path.resolve(__dirname, `../${destination}`);

    fs.readdir(folderPath, (err, files) => { //Verifica diretório enviado
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Diretório não pôde ser alcançado' }); 
        }
  
        files.forEach((file) => {
            const filePath = `${folderPath}/${file}`;
  
            file.slice(-3) == "txt"? fs.unlink(filePath, (err) => { //Apaga somente arquivos txt do diretório
            if (err) {
                console.error(err);
            } else {
                console.log(`Deleted file: ${filePath}`); //Se não ocorrer nenhum erro, informa cada txt apagado
            }
            })
            : res.status(400).json({ msg: 'Arquivo não-txt encontrado. Processo interrompido.' }) //Se um arquivo não-txt é achado, a função para e um aviso é emitido (a pasta deve ser voltada especificamente para arquivos txt)
        });
  
        res.json({ msg: 'Arquivos txt apagados com sucesso!' });
    });
});
  
module.exports = { operationsRouter: router, };