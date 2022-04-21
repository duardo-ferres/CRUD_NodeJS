const express = require('express')
const bodyParser = require('body-parser')
//definido para build do DB inicial
const _database = require("./database.js")
const _auth = require("./auth.js")
const _session = require("./session.js")
const _procedures = require("./procedures.js");

//inicializa variaveis necessarias
const app = express()
const port = 3000
const dbaseName = "./internal.db";

//instancia alguns componentes necessarios
let auth = new _auth.auth(dbaseName);
let session = new _session.session(dbaseName);

//da suporte ao body url encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**********************/
/*inicio dos listeners*/
/**********************/

//processa autenticacao
app.post('/api/auth', (req, res) => {
    //separa o path em partes legiveis
    pathSlices = req.path.split(/\//g);

    //classe para processamento das respostas
    proc = new _procedures.procedures(dbaseName, req, res, pathSlices);

    //recupera os dados
    const email = req.body.email;
    const password = req.body.password;
    
    if(email == null)   proc.failCallback("error_empty_email");
    else if(!email.includes("@"))   proc.failCallback("error_invalid_email");
    else if(password == null)   proc.failCallback("error_empty_password");
    else if(password.length < 4)   proc.failCallback("error_short_password");
    else
    {
        auth.logon(email, password, proc);
    }
});

//processa get
app.get('/api/*/*/*', (req, res) => {
    //separa o path em partes legiveis
    pathSlices = req.path.split(/\//g);

    //classe para processamento das respostas
    proc = new _procedures.procedures(dbaseName, req, res, pathSlices);

    //verifica tamanho do path
    if(pathSlices.length  == 5)
    {
        session.validate(pathSlices[2], "get", proc); 
    }
    //resposta de erro por url invalida
    else
    {
        res.statusCode = 200
        res.setHeader("Content-Type","application/json");
        res.send('{"status": 0, "desc":"request_url_error", "data": []}');   
    }
});

//processa post
app.post('/api/*/*', (req, res) => {

    var requestBody = "";
    req.on("data", function(data){

        //recupera o multipart form key
        if(req.headers["content-type"].includes("multipart/form-data"))
        {
            //divide valores em trechos usando patern
            patern = /Content-Disposition: form-data; name="(\S+)"\n\n(.*)/gm;
            while ((m = patern.exec(data.toString().replace(/\r/g, ""))) !== null) {
                //verifica se tem key e value
                if(m.length == 3)
                {
                    //popula o body
                    req.body[m[1]] = m[2];
                }
            }
        }
    });

    req.on("end", function(){
        //separa o path em partes legiveis
        pathSlices = req.path.split(/\//g);

        //classe para processamento das respostas
        proc = new _procedures.procedures(dbaseName, req, res, pathSlices);

        //verifica tamanho do path
        if(pathSlices.length  == 4)
        {
            session.validate(pathSlices[2], "post", proc); 
        }
        else
        {
            res.statusCode = 200
            res.setHeader("Content-Type","application/json");
            res.send('{"status": 0, "desc":"request_url_error", "data": []}');   
        }
    });
});

//processa put
app.put('/api/*/*/*', (req, res) => {

    console.log(req);

    //recupera os dados
    req.on("data", function(data){

        //recupera o multipart form key
        if(req.headers["content-type"].includes("multipart/form-data"))
        {
            //divide valores em trechos usando patern
            patern = /Content-Disposition: form-data; name="(\S+)"\n\n(.*)/gm;
            while ((m = patern.exec(data.toString().replace(/\r/g, ""))) !== null) {
                //verifica se tem key e value
                if(m.length == 3)
                {
                    //popula o body
                    req.body[m[1]] = m[2];
                }
            }
        }
    });

    req.on("end", function(){
        //separa o path em partes legiveis
        pathSlices = req.path.split(/\//g);

        //classe para processamento das respostas
        proc = new _procedures.procedures(dbaseName, req, res, pathSlices);

        //verifica tamanho do path
        if(pathSlices.length  == 5)
        {
            session.validate(pathSlices[2], "put", proc); 
        }
        else
        {
            res.statusCode = 200
            res.setHeader("Content-Type","application/json");
            res.send('{"status": 0, "desc":"request_error", "data": []}');   
        }
    });
});

//processa delete
app.delete('/api/*/*/*', (req, res) => {
    //separa o path em partes legiveis
    pathSlices = req.path.split(/\//g);

    //classe para processamento das respostas
    proc = new _procedures.procedures(dbaseName, req, res, pathSlices);

    //verifica tamanho do path
    if(pathSlices.length  == 5)
    {
        session.validate(pathSlices[2], "delete", proc); 
    }
    else
    {
        res.statusCode = 200
        res.setHeader("Content-Type","application/json");
        res.send('{"status": 0, "desc":"request_error", "data": []}');   
    }
});

app.listen(port, () =>{
    //inicializa banco de dados caso nao exista
    //product.buildDB();
    var db = new _database.database(dbaseName);
    db.create();
    db.populate();

    console.log(`Iniciado na porta ${port}!`);
});