var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 8080
var server = http.createServer(app);
var io = socketIo.listen(server);
server.listen(8080);
// add directory with our static files
app.use(express.static(__dirname + '/'));
console.log("Server running on 127.0.0.1:8080");

// array of all lines drawn
var line_history = [];


// event-handler for new incoming connections
io.on('connection', function (socket) {

    // first send the history to the new client
    for (var i in line_history) {
        socket.emit('draw_line', {size: line_history[i].Size, color: line_history[i].Color,  line: line_history[i].Data});
        console.log(line_history[i]);
    }

    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {
        // add received line to history 

        var input = {
            'Size': data.size,
            'Color': data.color,
            'Data': data.line 
        }

        var s = {'Size': data.size };
        var c = {'Color': data.color };
        var d = {'Data': data.line };

        line_history.push(input);
        // send line to all clients
        io.emit('draw_line', { size: data.size, color: data.color, line: data.line });

    });
});