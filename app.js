var http = require('http');
var childProcess = require('child_process');
var fs = require('fs');
var process;

var exec = function (response, i, commands) {
    console.log(commands[i]);
    process = childProcess.exec(commands[i]);

    process.stdout.on('data', function (chunk) {
        response.write(chunk);
    });

    process.stderr.on('data', function (chunk) {
        response.write('stderr:' + chunk);
    });

    process.on('close', function () {
        if (i === commands.length - 1) {
            response.write('closed');
            response.end();
        } else {
            exec(response, ++i, commands);
        }
    })
};

var server = http.createServer(function (request, response) {
    try {
        if (process) {
            process.kill();
        }

        var commands = fs.readFileSync("./deploy.commands").toString().split("\n");

        response.writeHead(200, {"Content-Type": "text/plain"});

        exec(response, 0, commands);
    } catch (e) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write('error' + e.message);
        response.end();
    }
});

server.listen(4000);