const mysql = require('mysql');

module.exports = {
    mysqlConnection: function () {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'secret',
            database: 'defaultdb',
            port: '3333'
        });
    },

    mysqlExec: function (mysql, patientTableStatement, dbquery, res, method) {
        mysql.connect(err => {
            if (err) {
                res.statusCode = 500;
                console.log(err)
                res.end(JSON.stringify({ message: 'Cannot connect to the database' }));
                return;
            }

            mysql.query(patientTableStatement, () => {

                mysql.query(dbquery, (err, results) => {
                    if (err) {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ message: 'Invalid SQL statement' }));
                        return;
                    }
                    
                    if (method === "GET") {
                        res.end(JSON.stringify({ message: 'Statement executed successfully', result: results}));
                    } else {
                        res.end(JSON.stringify({ message: 'Statement executed successfully' }));
                    }

                    mysql.end();
                    return;
                });
            });
        });
    },

    invalidSqlAction: function (dbquery, extraSqlAction) {
        let sqlStatements = dbquery.split(';');

        for (let i = 0; i < sqlStatements.length; i++) {
            let sqlAction = sqlStatements[i].split(' ')[0].trim();
            sqlAction = sqlAction.toUpperCase();
            if (sqlAction.includes('DROP') || sqlAction.includes('DELETE') || sqlAction.includes('UPDATE') || sqlAction.includes(extraSqlAction)) {
                return true;
            }
        }

        return false;
    }
};