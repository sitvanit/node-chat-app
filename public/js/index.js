const socket = io(); // that method is available because we load uo the socket.io script above. it initiates a request from the client to the server to open up a web socket and keep that connection open.

// arrow functions will work just in chrome, so we are going to use regular functions
socket.on('connect', function() {
    console.log('Connected to server'); // will be printed in the browser console
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
    const li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    // append the element as the last child
    jQuery('#messages').append(li);
});

// jQuery(x).on select element x and sets it
jQuery('#message-form').on('submit', function(element) {
    element.preventDefault(); // by default the submit of the form refreshes the page and adds query param to the url, we'd like to prevent it.

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {

    })
});
