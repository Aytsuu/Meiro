# app.py
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Enable cross origin resource sharing for all routes
CORS(app)

# Route to serve the HTML page with JavaScript
@app.route('/')

def home():
    return render_template('index.html')

# Route to handle AJAX request from JavaScript
@app.route('/api/data', methods=['GET', 'POST'])

def api_data():
    if request.method == 'POST':
        
        # Get data sent from JavaScript (POST request)
        data = request.json  # expects 

        # Do something with the data (e.g., process it)
        response = {'message': f'Hello, {data["name"]}!'}

        return jsonify(response)
    else:

        # Return a simple response to the JavaScript (GET request)
        return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(debug=True)
