const sqlite = require("sqlite3");
const crypto = require("crypto")

class database{
    constructor(dbaseName)
    {
        this.dbaseName = dbaseName;
    }

    setDatabaseName(dbaseName)
    {
        this.dbaseName = dbaseName;        
    }

    create()
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

        var query = `CREATE TABLE IF NOT EXISTS \`expenses\` (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao varchar(255),
            date datetime,
            user int(11),
            price double(255),
            deleted tinyint(1)
        );`;
        dbase.exec(query);

        console.log("criando tabela de usuarios");
        var query = `CREATE TABLE IF NOT EXISTS \`users\` (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cpf varchar(255)  NOT NULL UNIQUE,
            name varchar(255),
            address varchar(255),
            email varchar(255)  NOT NULL UNIQUE,
            password varchar(255),
            phone varchar(255),
            company int(11),
            deleted tinyint(1)
        );`;
        dbase.exec(query);


        console.log("criando tabela de usuarios");
        var query = `CREATE TABLE IF NOT EXISTS \`session\` (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user int(11),
            token varchar(128),
            expires int(11),
            deleted tinyint(1)
        );`;
        dbase.exec(query);
        
        dbase.close();
    }
    
    populate()
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
        (cpf, name, email, address, password, phone, company, deleted)
        VALUES 
        ('82319235000', 'Adilson Freitas', 'adilson@teste.com', 'Rua das Palmeiras, 236 - Nova Amelia', '21232f297a57a5a743894a0e4a801fc3', '3137356345', 0, 0),
        ('42736723082', 'Joao Aquino', 'joao@teste.com', 'Rua Bromelias Verdes, 456 - Granada', '21232f297a57a5a743894a0e4a801fc3', '3798650265', 0, 0),
        ('00694533068', 'Felipe Veiga', 'felipe@teste.com', 'Av. das Industrias, 32 - Joatubense', '21232f297a57a5a743894a0e4a801fc3', '6812348565', 0, 0)
        ON CONFLICT(email) DO UPDATE SET email = email
        ON CONFLICT(cpf) DO UPDATE SET cpf = cpf;`);

        dbase.run(`INSERT INTO \`expenses\`
        (descricao, date, user, price, deleted)
        VALUES 
        ('Despesa de Almoco', datetime('now','-10 minutes','localtime'), 1, 16.50, 0)
        `);
    }

    drop()
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
}

module.exports = {
    database
}