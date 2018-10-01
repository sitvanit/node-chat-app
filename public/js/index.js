const socket = io(); // that method is available because we load uo the socket.io script above. it initiates a request from the client to the server to open up a web socket and keep that connection open.

/** listen to connect event **/
// arrow functions will work just in chrome, so we are going to use regular functions
socket.on('connect', function() {
    console.log('Connected to server'); // will be printed in the browser console
});

/** listen to disconnect event **/
socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

/** listen to newMessage event **/
socket.on('newMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
});

/** listen to newLocationMessage event **/
socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');

    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
});

/** when submit a message in the web page emit a createMessage event **/
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

/** when click on getloacation buttom, emit a createLocationMessage event **/
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