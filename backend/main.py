# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from reinforcement_learning import DQL_agent

app = Flask(__name__)
CORS(app) # Enable CORS for all origins
socketio = SocketIO(app, cors_allowed_origins="*") # Allow all origins

# Route to serve the HTML page with JavaScript
@app.route('/')
def home():
    return render_template('index.html')


@socketio.on('send_to_flask')
def handle_send_to_js(data):

    # Get data sent from JavaScript (POST request)
    game_data = data

    # Start training the AI with the data received
    final_move = DQL_agent.train(game_data)

    # Send response to JavaScript
    emit('receive_from_flask', final_move)
    
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
