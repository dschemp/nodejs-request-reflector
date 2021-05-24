const express = require('express');
const app = express();
const fs = require('fs');

const http = require('http');
const https = require('https');

const httpsPort = 9999;
const httpPort = 9998;

/* Setup paths for certificates */
var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
    key: key,
    cert: cert
};

/* Pass request bodies as Json */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Extract information out of every request towards this server */
app.use((req, res) => {
    let obj = {
        connection: {
            protocol: req.protocol,
            isSecure: req.secure.valueOf(),
            originalUrl: req.originalUrl,
            hostname: req.hostname,
            httpVersion: req.httpVersion,
        },
        request: {
            method: req.method,
            path: req.path,
            query: req.query,
            headers: req.headers,
        },
        body: req.body,
    };
    console.debug(obj);

    /* send request data as Json back */
    res.contentType("json")
        .json(obj);
});

/* Init HTTP and HTTPS servers */
var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(app);

httpsServer.listen(httpsPort, () => {
    console.log(`Request reflector listening at https://localhost:${httpsPort}`);
});

httpServer.listen(httpPort, () => {
    console.log(`Request reflector listening at http://localhost:${httpPort}`);
});
