const http = require('http');
const url = require('url');
const utils = require('./modules/utils');

const rootEndPoint = '/COMP4537/labs/5/api/v1/sql/';
const patientTableStatement = 'CREATE TABLE IF NOT EXISTS Patient (PatientID INT NOT NULL AUTO_INCREMENT, Name VARCHAR(100) NOT NULL, DateOfBirth DATETIME NOT NULL, PRIMARY KEY(PatientID))';

http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    if (req.method === 'GET' && pathName === rootEndPoint) {

    } else if (req.method === 'POST' && pathName === rootEndPoint) {
        let body = '';

        req.on('data', chunk => {
            if (chunk !== null) {
                body += chunk;
            }
        });

        req.on('end', () => {
            const parsedBody = url.parse(body, true);
            const query = parsedBody.query;

            if (!query.dbquery) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Missing dbquery parameter' }));
                return;
            }

            const dbquery = query.dbquery;

            if (utils.invalidSqlAction(dbquery, 'SELECT')) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Post request cannot contain DROP, DELETE, UPDATE, or SELECT statements' }));
                return;
            }

            const mysql = utils.mysqlConnection();

            utils.mysqlExecStatement(mysql, patientTableStatement, dbquery, res);
        });
    }

}).listen(5000);