// Function to send data from JavaScript to Flask (POST request)

const socket = io.connect('http://127.0.0.1:5000')

// Listen for the response from Flask
socket.on('receive_from_flask', function(response) {

    if(window.callback){ // Call the callback with the data from Flask
        window.callback(response);
        window.callback = null;
    }
});

function sendData(data, callback){

    window.callback = callback;

    // Emit an event to Flask (server) with the data
    socket.emit('send_to_flask', data);

}