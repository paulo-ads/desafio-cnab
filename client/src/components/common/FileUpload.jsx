//Componente que renderiza o carregador de arquivos e toda a lógica envolvida nele
import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

// Função que carrega toda a sequência lógica por trás do processo de carregar, parsear e salvar as operations
function FileUpload() {
    const [file, setFile] = useState(null);
    const [cookies] = useCookies(['access_token']);

// Função chamada quando o usuário seleciona o arquivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile); //O arquivo selecionado é armazenado no useState 'file'
    };

// Função chamada quando o usuário clica em 'enviar'
// Retorna informações sobre o arquivo carregado
    const handleUpload = async () => {
        if (!file) {
        console.error('Erro: nenhum arquivo selecionado');
        return;
        }

        const formData = new FormData();
        formData.append('file', file); //Armazena o arquivo selecionado em uma estrutura de dados própria para o envio ao endpoint, onde o arquivo tem a chave 'file'

        try {
            const responseUpload = await axios.post('http://localhost:3001/operations/upload', formData, { // Requisição é feita, enviando o arquivo junto com headers especificando o tipo de conteúdo e o token de acesso.
                headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${cookies.access_token}`,}
        })
            console.log(`O arquivo foi carregado: ${responseUpload.data.filename}`); // O endpoint retorna um objeto com informações do arquivo enviado, incluindo o nome dele
            handleRead(responseUpload.data.filename); // Uma vez que a requisição tenha sido um sucesso e o nome do arquivo foi recuperado, a função de leitura é chamada e o nome do arquivo carregado é passado como argumento

        } catch (err) {
            console.error(err);
        }
    };

// Função é chamada quando o processo de carregar, parsear, salvar e registrar é concluído
// Apaga o arquivo txt do destino onde ele foi enviado e retorna uma confirmação do arquivo apagado
    const handleClear = async () => {
        try {
            const response = await axios.delete('http://localhost:3001/operations/upload/clear', {
                headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                },
            });
        
            console.log('Arquivos apagados:', response.data);
        } catch (err) {
            console.error( err);
        }
    };
    
// Função é chamada quando o arquivo carregado tem suas informações parseadas salvas no banco de dados
// Recebe o ID de uma operação salva no banco de dados e retorna a confirmação de que salvou a operação, bem como seu id
    const handleRegister = async (idOperation) => {
        try{
            const requestBody = {
                operationID: idOperation,
                userID: window.localStorage.getItem('userID'), //O id do usuário logado é inserido no corpo da requisição
            }

            const regOperation = await axios.put('http://localhost:3001/operations/upload/register', requestBody, { // O ID da operação é salvo no campo 'savedOperations' do usuário cujo ID foi enviado
                headers: {
                Authorization: `Bearer ${cookies.access_token}`, 
                },
            })
            console.log(regOperation) // É enviada uma confirmação de volta
            handleClear() // Todos os arquivos temporários txt são então limpos
        } catch(err){
            console.error(err);
        }
    }

// Função é chamada quando o arquivo carregado tem suas informações parseadas
// Recebe um array de objetos e retorna informações das operações salvas no banco de dados, incluindo seus ID's
    const handleSave = async (contentArray) => {
        const userCreator = window.localStorage.getItem('userID'); //Consegue-se o ID do usuário logado

        const operations = contentArray.map((item) => ({
            ...item,
            userCreator, //O id é inserido em cada objeto do array como um atributo (o id do usuário que carregou as operações é um campo necessário para salva-las no banco de dados)
        }))
        try{
            const savedOperation =  await axios.post('http://localhost:3001/operations/upload/save', JSON.stringify(operations), { // O array é enviado em formato JSON, junto com alguns headers da requisição 
                headers: {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${cookies.access_token}`, 
                },
            });
            console.log('Novas operações salvas:', savedOperation.data) // O retorno é outro array de objetos, onde cada objeto inclui o ID da operação recém salva
            for(const operation of savedOperation.data){ 
                await handleRegister(operation) // Cada operação salva que a função retornou é então enviada para a função de registrar a operação como criada pelo usuário logado
            }
        } catch(err){
            console.error(err)
        }
    }

// Função chamada quando o conteúdo do arquivo carregado é conseguido
// Recebe uma string, parseia a informação e retorna um array de objetos
    const handleParse = async (fileContent) => {
        try{
            const responseParse = await axios.post('http://localhost:3001/operations/upload/parse', { params: { fileContent } }, { // O conteúdo do arquivo carregado é então estruturado e parseado (principalmente através do módulo-classe CNAB)
                headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                },   
            });
            console.log(responseParse.data); // O retorno, caso a requisição dê certo, é um array de objetos prontos para serem salvos no banco de dados
            console.log(window.localStorage.getItem('userID'));
            handleSave(responseParse.data) // Esses objetos são enviados para a função de salvar no banco de dados
        } catch(err){
            console.error(err);
        }
    }

// Função chamada quando o arquivo é carregado com sucesso
// Recebe um nome de arquivo e retorna o conteúdo do mesmo
    const handleRead = async (filename) => {
        try{
            const responseRead = await axios.get('http://localhost:3001/operations/upload/read', { //É enviado o nome do arquivo como um req.param
                params: { filename },
                headers: {
                Authorization: `Bearer ${cookies.access_token}`, 
                },
            });
            console.log(`Arquivo foi lido: ${responseRead.data.fileContent}`); // Uma vez que a requisição dê certo, o retorno será o conteúdo do arquivo enviado
            handleParse(responseRead.data.fileContent); // Tal conteúdo é então enviado para ser parseado
        } catch(err){
            console.error(err);
        }

    }


    return (
        <div>
            <input type="file" accept=".txt" onChange={handleFileChange} name='file' />
            <button onClick={handleUpload}>Enviar</button>
        </div>
    );
}

export default FileUpload;
