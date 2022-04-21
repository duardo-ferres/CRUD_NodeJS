const sqlite = require("sqlite3");

class expenses{
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

        //procede com a query
        dbase.all(`SELECT * FROM \`expenses\` WHERE \`id\` = ${id} AND \`deleted\`=0`, function(err, result){
            if(err != null)
            {
                console.log("fail to do query");
                res.failCallback({"status": 0, "desc" : "error_to_get_data"});
                return;
            }

            
            if(result.length >= 1)  res.successCallback({"status": 1, "proc": "get_expenses", "desc" : result[0]});
            else                    res.failCallback({"status": 0, "proc": "get_expenses","desc" : "error_data_not_found"});
        });
        
        dbase.close();
    }
    
    insert(descricao, date, user, price, res)
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

        //procede com a query
        dbase.run(`INSERT INTO \`expenses\` 
        (\`descricao\`, \`date\`, \`user\`, \`price\`, \`deleted\`)
        VALUES('`+descricao+`', '`+date+`', '`+user+`', '`+price+`', 0);
        `, function(err, result){
            if(err)
            {
                console.log("fail to query");
                res.failCallback({"status": 0, "proc": "add_expense","desc" : "error_to_update_data"});
                return;
            }
            else  res.successCallback({"status": 1, "proc": "add_expense", "desc" : "succes_to_add_data"});
        });

        dbase.close();
    }

    delete(id = null, res)
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

        //procede com a query
        dbase.run(`UPDATE \`expenses\` SET \`deleted\` = 1 WHERE \`id\` = ${id}`, function(err, result){
            if(err)
            {
                console.log("fail to query");
                res.failCallback({"status": 0,  "proc": "del_expenses","desc" : "error_to_delete_data"});
                return;
            }
            else 
            { 
                res.successCallback({"status": 1,  "proc": "del_expenses","desc" : "succes_to_delete_data"});
            }
        });

        dbase.close();
    }

    update(id, descricao, date, user, price, res)
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

        //procede com a query
        dbase.run(`UPDATE \`expenses\` SET 
        \`descricao\` = '`+descricao+`',
        \`date\` = '`+date+`', 
        \`user\` = '`+user+`',
        \`price\` = '`+price+`'
        WHERE \`id\` = ${id} AND \`deleted\` = 0;
        `, function(err, result){
            if(err)
            {
                console.log("fail to query");
                console.log(err);
                res.failCallback({"status": 0,  "proc": "update_expenses","desc" : "error_to_update_data"});
                return;
            }
            else  res.successCallback({"status": 1,  "proc": "update_expenses","desc" : "succes_to_update_data"});
        });

        dbase.close();
    }
}

module.exports = {
    expenses
}