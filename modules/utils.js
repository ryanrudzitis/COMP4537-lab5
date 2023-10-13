const mysql = require('mysql');

module.exports = {
    mysqlConnect: function() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'secret',
            database: 'defaultdb',
            port: '3333'
        });
    }
};