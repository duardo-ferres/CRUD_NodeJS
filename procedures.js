const nodemailer = require('nodemailer');
const _expenses = require("./expenses.js")
const _users = require("./users.js")

//instancia os objetos necessarios
let expenses = new _expenses.expenses("");
let users = new _users.users("");

//configuracao de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'yourpassword'
    }
  });

//classe de procedimentos padroes
class procedures
{
    constructor(dbaseName, req, res, path)
    {
        this.req = req;
        this.res = res;
        this.path = path;
        this.dbaseName = dbaseName; 

        //seta o nome da base de dados para a classe
        expenses.setDatabaseName(dbaseName);
        users.setDatabaseName(dbaseName);
    }

    setDatabaseName(dbaseName)
    {
        this.dbaseName = dbaseName;        
    }

    __sendMail(dest, details){
        //configura o email para envio
        var mailOptions = {
            from: 'plataforma@gmail.com',
            to: dest,
            subject: 'Despesa Cadastrada',
            text: 'A despesa : '+details+' \r\n Cadastrada com Sucesso!'
        };
        
        //faz envio do email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    __isDate(date) {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    }

    successCallback(data)
    {
        //processa adicao de despesa enviando email
        if(data["proc"] == "add_expense")
        {
            var desc = this.req.body.description;
            desc += "no valor de ";
            desc += this.req.body.value;


            //envia email para o usuario
            this.__sendMail(this.userData["userMail"], desc);
        }

        //envia email ao usuario
        this.res.statusCode = 200
        this.res.setHeader("Content-Type","application/json");
        this.res.send(JSON.stringify({"status":1 ,"desc":"success", "data": data["desc"]}));
    }

    failCallback(data)
    {
        this.res.statusCode = 400
        this.res.setHeader("Content-Type","application/json");
        this.res.send(JSON.stringify({"status":0 ,"desc":"request_error", "data": data["desc"]}));
    }

    procGet(status, data)
    {
        //adiciona dados dos usuarios ao processamento
        this.userData = data;

        console.log(status);

        if(status == true)
        {
            this.res.statusCode = 200
            this.res.setHeader("Content-Type","application/json");

            if(this.path[3] == "expenses")         expenses.get(pathSlices[4], this);  
            else if(this.path[3] == "user")        users.get(pathSlices[4], this);  
            else if(this.path[3] == "session")     session.get(pathSlices[4], this);     
            else {this.send('{"status":0 ,"desc":"request_error", "data": []}');}  

        }
        else
        {  
            this.res.send('{"status":0 ,"desc":"request_auth_error", "data": []}'); 
        }
    }

    procPost(status, data)
    {
        //adiciona dados dos usuarios ao processamento
        this.userData = data;

        console.log(data);

        //console.log(this.req);

        if(status == true)
        {
            if(this.path[3] == "expenses") 
            {
                const description = this.req.body.description;
                const date = this.req.body.date;
                const value = this.req.body.value.replace(",", ".");
                const user = data["userId"];

                //verifica se valores sao nulos
                if(description == null)         this.failCallback("description_canot_be_null");
                else if(date == null)            this.failCallback("date_canot_be_null");
                else if(value == null)           this.failCallback("value_canot_be_null");

                //verifica formato dos valores
                else if(!this.__isDate(date))         this.failCallback("date_is_not_valid_iso_format");
                else if(isNaN(value))            this.failCallback("value_need_to_be_number");

                //verifica se valores sao validos
                else if(value < 0)                       this.failCallback("price_must_be_positive");
                else if(new Date(date) > new Date())     this.failCallback("date_must_not_be_future");
                else if(description.length > 191)        this.failCallback("description_must_be_less_than_191_characters");
                
                //insere a despesa lancada pelo usuario no banco
                else expenses.insert(description, date, user, value, this);
            }   
            //else if(this.path[3] == "user")        users.insert(pathSlices[4], this);    
            else {this.send('{"status":0 ,"desc":"request_error", "data": []}');}  

        }
        else
        {  
            this.res.send('{"status":0 ,"desc":"request_auth_error", "data": []}'); 
        }
    }

    procPut(status, data)
    {
        //adiciona dados dos usuarios ao processamento
        this.userData = data;

        console.log(status);

        if(status == true)
        {
            if(this.path[3] == "expenses") 
            {
                const id = this.path[4];
                const description = this.req.body.description;
                const date = this.req.body.date;
                const value = this.req.body.value.replace(",", ".");
                const user = data["userId"];

                //verifica se valores sao nulos
                if(description == null)     this.failCallback("description_canot_be_null");
                else if(date == null)            this.failCallback("date_canot_be_null");
                else if(value == null)           this.failCallback("value_canot_be_null");

                //verifica formato dos valores
                else if(!this.__isDate(date))         this.failCallback("date_is_not_valid_iso_format");
                else if(isNaN(value))            this.failCallback("value_need_to_be_number");

                //verifica se valores sao validos
                else if(value < 0)                       this.failCallback("price_must_be_positive");
                else if(new Date(date) > new Date())     this.failCallback("date_must_not_be_future");
                else if(description.length > 191)        this.failCallback("description_must_be_less_than_191_characters");
                
                //insere a despesa lancada pelo usuario no banco
                else expenses.update(id, description, date, user, value, this);
            }   
            //else if(this.path[3] == "user")        users.insert(pathSlices[4], this);    
            else {this.send('{"status":0 ,"desc":"request_error", "data": []}');}  

        }
        else
        {  
            this.res.send('{"status":0 ,"desc":"request_auth_error", "data": []}'); 
        }
    }

    procDelete(status, data)
    {
        //adiciona dados dos usuarios ao processamento
        this.userData = data;

        if(status == true)
        {
            this.res.statusCode = 200
            this.res.setHeader("Content-Type","application/json");

            if(this.path[3] == "expenses") 
            {
                const id = this.path[4];

                //insere a despesa lancada pelo usuario no banco
                expenses.delete(id, this);
            }   
            //else if(this.path[3] == "user")        users.insert(pathSlices[4], this);    
            else {this.send('{"status":0 ,"desc":"request_error", "data": []}');}  

        }
        else
        {  
            this.res.send('{"status":0 ,"desc":"request_auth_error", "data": []}'); 
        }
    }
}


module.exports = {
    procedures
}