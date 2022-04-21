const sqlite = require("sqlite3");
const crypto = require("crypto")

class users{
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

        dbase.all(`SELECT * FROM \`users\` WHERE \`id\` = ${id} AND \`deleted\` = 0`, function(err, result){
            if(err != null)
            {
                console.log("fail to do query");
            }

            if(result.length >= 1)  res.successCallback(result[0]);
            else                    res.failCallback();
        });
    }
    
    insert(cpf, name, email, address, password, phone, company)
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

        dbase.run(`INSERT INTO \`users\`
        (cpf, name, address, email, password, phone, company, deleted)
        VALUES('`+cpf+`', '`+name+`', '`+address+`', '`+email+`', '`+password+`', '`+phone+`', `+company+`, 0);
        `);
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

        dbase.run(`UPDATE \`users\` SET \`deleted\` = 1 WHERE \`id\` = ${id}`);
        
    }

    update(id, cpf, name, email, address, password, phone, company)
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

        dbase.run(`UPDATE \`users\` SET 
        cpf = '`+cpf+`',
        name = '`+name+`', 
        address = '`+address+`',
        password = '`+password+`', 
        phone = '`+phone+`', 
        email = '`+email+`', 
        company = `+company+` , 
        deleted = `+deleted+` 
        WHERE \`id\` = ${id};
        `);
        
    }
}

module.exports = {
    users
}