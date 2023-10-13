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

    mysqlExecStatement: function (mysql, patientTableStatement, dbquery, res) {
        mysql.connect(err => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ message: 'Internal server error' }));
                return;
            }

            mysql.query(patientTableStatement, (err) => {
                if (err) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ message: 'Invalid SQL statement' }));
                    return;
                }

                mysql.query(dbquery, (err) => {
                    if (err) {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ message: 'Invalid SQL statement' }));
                        return;
                    }
    
                    res.end(JSON.stringify({ message: 'Statement executed successfully' }));
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
            if (sqlAction === 'DROP' || sqlAction === 'DELETE' || sqlAction === 'UPDATE' || sqlAction === extraSqlAction) {
                return true;
            }
        }

        return false;
    }
};