const sqlite = require("sqlite3");
const _session = require("./session.js");
const crypto = require("crypto");
const res = require("express/lib/response");

class auth{
    constructor(dbaseName)
    {
        this.dbaseName = dbaseName;
    }

    setDatabaseName(dbaseName)
    {
        this.dbaseName = dbaseName;        
    }

    logon(email, pass, res)
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

        var session = new _session.session(this.dbaseName);

        dbase.all(`SELECT * FROM \`users\` WHERE \`email\` = '${email}' AND \`password\` = '${crypto.createHash('md5').update(pass).digest('hex')}';`, function(err, result){
            if(err != null)
            {
                console.log("fail to do query");
            }

            var resp = {
                "cpf" : result[0]["cpf"],
                "name" : result[0]["name"],
                "email" : result[0]["email"],
                "phone" : result[0]["phone"],
                "session" : session.insert(result[0]["email"])
            }

            res.successCallback(resp);
        });
    }
    
    logout(token)
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

        dbase.run(`UPDATE \`session\` SET \`deleted\` = 1 WHERE \`token\` = ${token}`, function(err, result){
            if(err != null)
            {
                console.log("fail to do query");
            }
            if(result)  res.successCallback(resp);
            else  res.failCallback("fail to logout");
        });
    }
}

module.exports = {
    auth
}