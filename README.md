![screenshot-desafio-cnab](https://github.com/paulo-ads/desafio-cnab/assets/116691517/9f839ba5-10b7-4922-a006-b75ea8e0a560)
# desafio-cnab

'Desafio CNAB' é uma aplicação web, criada com a stack MERN **(MongoDB, Express, React e Node.JS)** que oferece aos seus usuários cadastrados um **sistema de carregamento e parseamento de arquivos CNAB**, bem como **te-los salvos em um banco de dados em núvem e renderizados em formato de tabela** para melhor visualização.

Para garantir a segurança de dados, o sistema apenas mostrará as operações carregadas pelo usuário logado.

## Features

#### **Crie sua conta;**
#### **Logue-se e veja suas operações enviadas, atualizadas em tempo real;**
#### **Carregue novas operações através de um simples carregador de arquivos txt;**
#### **Ao apertar o botão 'Atualizar', tenha suas novas operações renderizadas em uma prática tabela;**
#### **O sistema também renderiza o saldo total de cada loja cadastrada pelas operações, facilitando a visualização de dados;**
#### **Operações que incluirem erros serão renderizadas numa segunda tabela, apontando onde está o erro ou despadronização;**
#### **Suas operações somente serão vistas por você: o sistema utiliza Json Web Tokens (JWT) para garantir a segurança de dado;s**
#### **Seus arquivos enviados não ficam salvos no servidor e são excluídos assim que não mais necessários;**

## Funcionamento e Stack
### Server
A pasta 'server' contém os arquivos necessários para o funcionamento do backend (rotas, módulos e configurações de conexão com o banco de dados, principalmente).

A função do backend nessa aplicação é receber requisições do cliente, processa-las e retornar as devidas informações (parsear os dados de arquivos txt CNAB ou salvar usuários no banco de dados, por exemplo)

As principais tecnologias utilizadas aqui são:

**Express:** Usado para lidar com requisições HTTP, middlewares e configurações de roteamento.

**Mongoose:** Usado para se conectar e realizar requisições com o banco de dados MongoDB.

**Bcrypt:** Criptografa a senha do usuário antes de manda-la para o banco de dados.

**Multer:** Usado para configurar e lidar com o envio de arquivos pelo endpoint de 'upload'.

**Json Web Token:** Utilizado para manter o usuário logado, bem como validar se requisições tem a autorização para usar endpoints privados.

### Client
A pasta 'client' possui os arquivos necessários para o funcionamento do frontend (componentes para renderizar as informações no navegador, requisições ao servidor e componentes de interface gráfica, por exemplo).

A função do frontend nessa aplicação é servir como ponte entre o usuário e o servidor. Através de seus componentes de interface web, o frontend faz requisições e lida com as respostas (as renderizando ou as mandando para outra requisição).

As principais tecnologias utilizadas aqui são:

**React:** Renderiza componentes de interface de usuário e oferece ferramentas para lidar tanto com o envio de requisições ao servidor quanto com suas respostas.

**React-Cookies:** Armazena os tokens de acesso (JWT) e facilita o uso deles para requisições ao backend.

**Axios:** Realiza solicitações HTTP ao servidor backend.

**Bootstrap:** Estilização de componentes da interface WEB, bem como padronização da interface gráfica.

## Banco de dados
**Esse projeto já vem com as credenciais de um banco de dados meu no arquivo .env.**

Essas credenciais serão futuramente alteradas, então se você não conseguir se conectar ao banco de dados, simplesmente substitua a string de conexão no **server/index.js** com a string de conexão do seu banco de dados mongoDB. 

Alternativamente, você pode configurar o .env para carregar informações do seu banco de dados.

## Como rodar
Esse projeto requer tanto que o servidor backend (server) quanto o servidor frontend (client) estejam rodando. 


#### Clone o projeto:
```bash
git clone https://github.com/paulo-ads/desafio-cnab.git
```

#### Entre na pasta server e instale as dependências:
```bash
cd server
```
```bash
npm i
```
#### Inicie o servidor backend:
```bash
npm start
```
#### Em outro terminal, entre na pasta client:
```bash
cd client
```
#### Instale as dependências:
```bash
npm i
```
#### Inicie o servidor frontend:
```bash
npm run dev
```

#### Por padrão, a aplicação WEB inicia na porta 5173
**Você pode acessa-la em http://localhost:5173/*
