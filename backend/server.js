// Function to make a GET request to Flask
function fetchData(){
    fetch("http://127.0.0.1:5000/api/data")
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok.');
        }

        return response.json() // Parse the body as JSON
    })
    .then(data => {
        console.log("Data Received:", data); // Handle the parsed JSON data
    })
    .catch(error => {
        console.log("There was a problem with the fetch operation:", error); // Handle error when fetching data
    })
}

// Function to send data from JavaScript to Flask (POST request)
function sendData(){

    // Data to be sent to flask
    const data = 
        {
            name: 'John'
        };

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
        console.log("Data:", data); // Handle the parsed JSON data
    })
    .catch(error => {
        console.log("There was a problem with the fetch operation:", error); // Handle error when fetching data
    })
}