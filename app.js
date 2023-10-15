const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const PORT = 5000;
const rootEndPoint = '/COMP4537/labs/5/api/v1/sql/';
const patientTableStatement = 'CREATE TABLE IF NOT EXISTS Patient (PatientID INT NOT NULL AUTO_INCREMENT, Name VARCHAR(100) NOT NULL, DateOfBirth DATETIME NOT NULL, PRIMARY KEY(PatientID))';

http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    if (req.method === 'GET' && pathName === rootEndPoint) {
        const query = parsedUrl.query;

        if (!query.dbquery) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Missing dbquery parameter' }));
            return;
        }

        let dbquery = query.dbquery;

        if (utils.invalidSqlAction(dbquery, 'INSERT')) {
            res.statusCode = 400;
            res.end(JSON.stringify({ message: 'Get request cannot contain DROP, DELETE, UPDATE, or INSERT statements' }));
            return;
        }

        if (dbquery.includes('patient') || dbquery.includes('PATIENT')) {
            dbquery = dbquery.replace('patient', 'Patient');
            dbquery = dbquery.replace('PATIENT', 'Patient');
        }

        const mysql = utils.mysqlConnection();

        utils.mysqlExec(mysql, patientTableStatement, dbquery, res, req.method);

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

            let dbquery = query.dbquery;

            if (utils.invalidSqlAction(dbquery, 'SELECT')) {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Post request cannot contain DROP, DELETE, UPDATE, or SELECT statements' }));
                return;
            }

            if (dbquery.includes('patient') || dbquery.includes('PATIENT')) {
                dbquery = dbquery.replace('patient', 'Patient');
                dbquery = dbquery.replace('PATIENT', 'Patient');
            }

            const mysql = utils.mysqlConnection();

            utils.mysqlExec(mysql, patientTableStatement, dbquery, res, req.method);
        }
        );
    }

}).listen(PORT);