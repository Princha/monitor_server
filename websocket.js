exports.start = function (server) {
    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
        console.log('websocket onConnection')
        socket.emit('news', { hello: 'world' });
        socket.on('anotherNews', function (data) {
            console.log(data);
        });
    });
}
