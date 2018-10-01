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

socket.on('newLocationMessage', function (message) {
    const li = jQuery('<li></li>');
    // The <a> tag defines a hyperlink, which is used to link from one page to another.
    // target="_blank" redirect to a new tab. without it, it will be opened on the same page.
    const a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

// jQuery(x).on select element x and sets it
jQuery('#message-form').on('submit', function(element) {
    element.preventDefault(); // by default the submit of the form refreshes the page and adds query param to the url, we'd like to prevent it.

    const messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val(''); // the acknowledgement callback func just clear the textbox message
    })
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.')
    })
});