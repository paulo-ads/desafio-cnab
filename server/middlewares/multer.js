// 'Middleware' de configuração do 'Multer', módulo utilizado para configurar o carregamento de arquivos
const multer = require('multer');

//O 'Middleware' recebe um objeto e o retorna com as configurações necessárias para permitir o armazenamento dos arquivos temporários
// Nesse processo, o objeto enviado como argumento retorna com o middleware dentro dele
const enviaFile = (objeto) => {

    // O destino dos arquivos salvos é, por padrão, a pasta 'uploads'
    const destination = 'uploads/';
    var upload = multer({dest: destination});

    // São configurados atributos futuramente necessários (destination and filename)
    const storage =  multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, destination);
         },
        filename: function (req, file, cb) {
            cb(null , file.originalname);
        }
    });
    
    var upload = multer({ storage: storage });
    objeto = { upload: upload, destination: destination }
    return objeto // A função retorna o argumento enviado como um objeto que inclui um middleware (upload)
}

module.exports = enviaFile;
