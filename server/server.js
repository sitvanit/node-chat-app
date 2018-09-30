const path = require('path');
const http = require('http');
const express = require('express'); // http server - express is using node module called 'http' to create http server
const socketIO = require('socket.io'); // set up a server that supports web sockets, and to create a FE that communicates with the server (has BE and FE libraries)

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
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to chat app',
        createdAt:  new Date().getTime()
    });

    // socket.broadcast.emit sends the event to everybody except that socket
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        // io.emit emits an event to every single connection
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

