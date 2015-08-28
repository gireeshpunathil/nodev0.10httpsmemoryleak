var fs = require('fs');
var https = require('https');
var http = require('http');

var options = {key: fs.readFileSync('key.pem'),cert: fs.readFileSync('cert.pem'), requestCert: false, rejectUnauthorized: false};

var data = new Buffer(1024 * 1024);
data.fill('g');

var server = https.createServer(options, function(req, res) {
res.end(data);
});

server.listen(23456, function () {
console.log('1 MB https server listening.');
});

