const sqlite = require("sqlite3");
const crypto = require("crypto");
const { response } = require("express");

class session{
    constructor(dbaseName)
    {
        this.dbaseName = dbaseName;
    }

    setDatabaseName(dbaseName)
    {
        this.dbaseName = dbaseName;        
    }

    get(id = null, res)
    {
        var dbase = new sqlite.Database(this.dbaseName, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, function(error, dbase){
            if(!error == null)
            {
                console.log("error to open Database");
                return;
            }
            else
            {
                console.log("success to open database");
            }
        });

        dbase.all(`SELECT \`token\` FROM \`session\` WHERE \`id\` = '${id}' AND \`deleted\` = 0 AND \`expires\` > datetime()`, function(err, result){
            if(err != null)
            {
                console.log("fail to do query");
            }
            
            if(result.length >= 1)  res.successCallback(result[0]);
            else                    res.failCallback();
        });

    }

    validate(token, type, proc)
    {
        var dbase = new sqlite.Database(this.dbaseName, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, function(error, dbase){
            if(!error == null)
            {
                console.log("error to open Database");
                return;
            }
            else
            {
                console.log("success to open database");
            }
        });

        dbase.all(`SELECT \`users\`.\`email\` as \`userMail\`,  \`users\`.\`id\` as \`userId\`, \`users\`.\`name\` as \`userName\` FROM \`session\` INNER JOIN \`users\` ON \`users\`.\`id\` = \`session\`.\`user\` WHERE \`session\`.\`token\` = '${token}' AND \`users\`.\`deleted\` = 0 AND \`session\`.\`expires\` > datetime()`, function(err, result){
            if(err != null)
            {
                console.log("fail to do query");
            }

            console.log(result);

            //verifica se a secao existe
            if(result)
            {
                if(type == "get")   proc.procGet(true, result[0]);
                else if(type == "post")   proc.procPost(true, result[0]);
                else if(type == "put")   proc.procPut(true, result[0]);
                else if(type == "delete")   proc.procDelete(true, result[0]);
            }
            else
            {
                if(type == "get")   proc.procGet(false, []);                 
                else if(type == "post")   proc.procPost(true, []);             
                else if(type == "put")   proc.procPut(true, []);             
                else if(type == "delete")   proc.procDelete(true, []);              
            }
        });
        
    }
    
    insert(user)
    {
        
        var dbase = new sqlite.Database(this.dbaseName, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, function(error, dbase){
            if(!error == null)
            {
                console.log("error to open Database");
                return;
            }
            else
            {
                console.log("success to open database");
            }
        });

        var token = crypto.createHash('md5').update(user+(new Date()).toISOString()).digest('hex');
        var expires = new Date();
        expires.setDate(expires.getDate() + 5);

        dbase.run(`INSERT INTO \`session\`
        (user, token, expires, deleted)
        VALUES('`+user+`', '`+token+`', '`+expires.toISOString()+`', 0);
        `);
        
        return token;
    }

    delete(id = null)
    {
        var dbase = new sqlite.Database(this.dbaseName, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, function(error, dbase){
            if(!error == null)
            {
                console.log("error to open Database");
                return;
            }
            else
            {
                console.log("success to open database");
            }
        });

        dbase.run(`UPDATE \`session\` SET \`deleted\` = 1 WHERE \`id\` = ${id}`);
    }
}

module.exports = {
    session
}