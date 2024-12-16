// Function to send data from JavaScript to Flask (POST request)

function sendData(data, callback){

    const socket = io.connect('http://127.0.0.1:5000')

    // Emit an event to Flask (server) with the data
    socket.emit('send_to_flask', data);
    
    // Listen for the response from Flask
    socket.on('receive_from_flask', function(response) {
        console.log("Received from Flask:", response);
        callback(response); // Call the callback with the data from Flask
    });

}