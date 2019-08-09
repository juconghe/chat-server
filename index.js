const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    path: '/chat/'
});

const userSocketIdMap = {};
const socketIdUserMap = {};

io.on('connection', socket => {
    socket.on('disconnect', () => {
        const userName = socketIdUserMap[socket.id];
        delete userSocketIdMap[userName];
        delete socketIdUserMap[socket.id];
        console.log(userSocketIdMap, socketIdUserMap);
    });

    socket.on('subscribe', ({ userName }) => {
        userSocketIdMap[userName] = socket.id;
        socketIdUserMap[socket.id] = userName;
    });

    socket.on('sendMessage', ({ message, toUser }) => {
        const socketId = userSocketIdMap[toUser];
        const fromUser = socketIdUserMap[socket.id];
        socket.to(socketId).emit('message', {
            message,
            fromUser
        });
    });
});

http.listen(8080, () => {
    console.log('listening on 8080');
});
