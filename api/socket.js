const socket = require('socket.io');

module.exports = (server) => {
    const io = socket(server, {
        pingTimeout: 60000,
        cors: {
            origin: '*',
        }
    });

    io.on('connection', (socket) => {
        console.log('Connected to Socket');

        socket.on('setup', (userData) => {
            socket.join(userData?.id);
            socket.emit('connected');
        });

        socket.on('joinChat', (chat) => {
            socket.join(chat);
            console.log('Joined ', chat);
        });

        socket.on('typing', (chat, user) => {
            socket.in(chat).emit('typing', user);
        });

        socket.on('stopTyping', (chat) => {
            socket.in(chat).emit('stopTyping');
        });

        socket.on('newMessage', (newMessage) => {
            let chat = newMessage.chat;
            if (!chat.users) return console.log('Chat.users not defined');
            chat.users.forEach((user) => {
                if (user.id === newMessage.sender) return;
                socket.in(user.id).emit('messageReceived', newMessage);
            });
        });

        socket.on('newGroup', (group) => {
            group.users.forEach((user) => {
                if (user.id === group.sender) return;
                socket.in(user.id).emit('groupCreated', group);
            })
        });

        socket.on('updateGroup', (group) => {
            group.users.forEach((user) => {
                if (user.id === group.groupAdminId) return;
                socket.in(user.id).emit('groupUpdated', group);
            })
        })
    })
};