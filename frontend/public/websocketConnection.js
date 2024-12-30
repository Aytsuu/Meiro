// Function to send data from JavaScript to Flask (POST request)

const socket = io.connect('https://meiro.onrender.com', {
    reconnection: true, // Ensure it will reconnect on failure
    reconnectionAttempts: 3, // Reduce the number of reconnection attempts
    reconnectionDelay: 1000, // Increase the delay between reconnections
    timeout: 5000 // Increase connection timeout
});

// Handle connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    alert('Unable to connect to the server. Please try again later.');
});

// Handle WebSocket disconnection
socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server.');
    alert('Disconnected from the server. Reconnecting...');
});

// Listen for the response from Flask

socket.on('receive_from_flask', (response) => {

    if(response){

        const action = response.action
        const phase = response.phase
        const aiId = response.aiId

        enemy[aiId].action = action
        enemy[aiId].phase = phase

        if((!enemy[aiId].isAttack && !isGamePaused) && JSON.stringify(enemy[aiId].action) != JSON.stringify(enemy[aiId].prevAction))  {
            enemy[aiId].setState(enemy[aiId].getStateFromAction());
            enemy[aiId].prevAction = action;
        }
        
    }

});

function sendData(data, aiId){

    data.aiId = aiId

    // Emit an event to Flask (server) with the data
    if(!enemy[aiId].isAttack && !isGamePaused) socket.emit('send_to_flask', data);

}

function sendResponse(data, aiId){

    data.aiId = aiId

    // Emit an event to Flask (server) with the data
    if(!enemy[aiId].isAttack && !isGamePaused) socket.emit('send_to_flask', data);

}