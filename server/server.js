const path = require('path');
const http = require('http');
const express = require('express'); // http server - express is using node module called 'http' to create http server
const socketIO = require('socket.io'); // set up a server that supports web sockets, and to create a FE that communicates with the server (has BE and FE libraries)

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; // must have process.env.PORT for heroku.
const app = express();
const server = http.createServer(app); // express is using the same function, we should do it explicitly in order to use socket.io
const io = socketIO(server); // with that variable we can emit or listen to events

// app.use add a middleware
// express.static add a static page, it gets the absolute path
app.use(express.static(publicPath));

// register an event listener - a client connect to the server
io.on('connection', (socket) => {
    console.log('New user connected');
    // socket.emit emits an event to a specific connection (socket)
    // newMessage event is emitted by they server and is listened by the client
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
    // socket.broadcast.emit sends the event to everybody except that socket
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    // createMessage event is emitted by the client and is listened by the server
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        // io.emit emits an event to every single connection
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

