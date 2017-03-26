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
        //console.log(line_history[i]);
    }
    // add handler for message type "draw_line".
    socket.on('draw_line', function (data) {

        // add input to line_history objects
        var input = {
            'Size': data.size, // size of the brush
            'Color': data.color, // color of the line
            'Data': data.line // position of the line
        }
        // push objects to add
        line_history.push(input);

        // remove the first 150 objects from the array list if the total array list exceeds 1500 entries
        if(line_history.length >= 1500){
            line_history.splice(0, 150);
        }

        // send line to all clients
        io.emit('draw_line', { size: data.size, color: data.color, line: data.line });
        //console.log(line_history.length);
    });
});