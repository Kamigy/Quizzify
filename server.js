const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

let rooms = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('create-room', (roomName) => {
        if (!rooms[roomName]) {
            socket.join(roomName);
            rooms[roomName] = socket.id;
            socket.emit('room-created', roomName);
        } else {
            socket.emit('error', 'Room already exists!');
        }
    });

    socket.on('join-room', (roomName) => {
        if (rooms[roomName]) {
            socket.join(roomName);
            socket.emit('joined-room', roomName);
        } else {
            socket.emit('error', 'Room does not exist!');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

