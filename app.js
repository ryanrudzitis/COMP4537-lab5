const http = require('http');
const url = require('url');
const utils = require('./modules/utils');

const rootEndPoint = '/COMP4537/labs/5/api/v1/sql/';

http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    if (req.method === 'GET' && pathName === rootEndPoint) {
        const query = parsedUrl.query;
        const mysql = utils.mysqlConnect();

        

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
            const dbquery = query.dbquery;

            const mysql = utils.mysqlConnect();
            mysql.connect(function(err) {
                if (err) throw err;
                mysql.query(dbquery, function(err, result) {
                    if (err) throw err;
                    console.log("Aight");
                })
            })
        });
    }

}).listen(5000);