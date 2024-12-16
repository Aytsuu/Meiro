# app.py
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from reinforcement_learning import DQL_agent

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
        game_data = request.json  # expects 

        # Start training the AI with the GAMEDATA received
        final_move = DQL_agent.train(game_data)

        return jsonify(final_move)
    else:

        # Return a simple response to the JavaScript (GET request)
        return jsonify({'message': 'Hello from Flask!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
