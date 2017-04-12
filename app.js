var http = require('http');
var childProcess = require('child_process');
var process;

var server = http.createServer(function (request, response) {

    try {
        response.writeHead(200, {"Content-Type": "text/plain"});
        if (process) {
            process.kill();
        }

        process = childProcess.spawn('./deploy.sh');

        process.stdout.on('data', function (chunk) {
            response.write(chunk);
        });

        process.stderr.on('data', function (chunk) {
            response.write('stderr:' + chunk);
        });

        process.on('close', function () {
            response.write('closed');
            response.end();
        })
    } catch (e) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write('error' + e.message);
        response.end();
    }
});

server.listen(4000);