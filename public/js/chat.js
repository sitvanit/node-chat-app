const socket = io(); // that method is available because we load uo the socket.io script above. it initiates a request from the client to the server to open up a web socket and keep that connection open.

/** autoscrolling **/
function scrollToBottom () {
    // Selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');
    // Heights
    const clientHeight = messages.prop('clientHeight'); // The visible messages container.
    const scrollTop = messages.prop('scrollTop'); // The number of pixel we scroll down in order to see the messages.
    const scrollHeight = messages.prop('scrollHeight'); // The entire height of the messages container.
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

/** listen to connect event **/
// arrow functions will work just in chrome, so we are going to use regular functions
socket.on('connect', function() {
    const params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err); // will preview the error on the page
            window.location.href = '/'; // and then redirect to the home page
        } else {
            console.log('No error');
        }
    })
});

/** listen to disconnect event **/
socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('updateUsersList', function(users) {
    const ul = jQuery('<ul></ul>');

    users.forEach(function(user) {
        ul.append(jQuery('<li></li>').text(user))
    });

    jQuery('#users').html(ul);
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
    scrollToBottom();
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
    scrollToBottom();
});

/** when submit a message in the web page emit a createMessage event **/
// jQuery(x).on select element x and sets it
jQuery('#message-form').on('submit', function(element) {
    element.preventDefault(); // by default the submit of the form refreshes the page and adds query param to the url, we'd like to prevent it.

    const messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
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