// Function to send data from JavaScript to Flask (POST request)
function sendData(data, callback){

    fetch("http://127.0.0.1:5000/api/data", {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok.') 
        }

        return response.json() // Parse the body as JSON
    })
    .then(data => {
        callback(data); // Callback to the function was called and passing the returned data from Flask
    })
    .catch(error => {
        console.log("There was a problem with the fetch operation:", error); // Handle error when fetching data
    })
}