function sockets(io, socket, data) {

    socket.on('siteLoaded', function() {
      socket.emit('allData', data.data);
    });
}

module.exports = sockets;