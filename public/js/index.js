const socket = io(); // that method is available because we load uo the socket.io script above. it initiates a request from the client to the server to open up a web socket and keep that connection open.

// arrow functions will work just in chrome, so we are going to use regular functions
socket.on('connect', function() {
    console.log('Connected to server'); // will be printed in the browser console

    socket.emit('createMessage', {
       from: 'hen',
       text: 'hey'
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
});
