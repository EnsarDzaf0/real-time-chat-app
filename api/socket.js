const socket = require('socket.io');

module.exports = (server) => {
    const io = socket(server, {
        pingTimeout: 60000,
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};