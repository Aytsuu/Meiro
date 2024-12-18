# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from DQN_agent import Train

app = Flask(__name__)
CORS(app) # Enable CORS for all origins
socketio = SocketIO(app, cors_allowed_origins="*") # Allow all origins

# Route to serve the HTML page with JavaScript
@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('send_to_flask')
def handle_send_to_flask(data):

    final_move = None
    phase = None

    # Get data sent from JavaScript (POST request)
    game_data = data

    # Training Phases
    if (game_data['phase']) == 1:
        final_move, phase = train.first_training(game_data)
    else:
        train.second_training(game_data)
    
    # JSON data to be passed to javascript
    data = {
        'action': final_move,
        'phase': phase
    }

    # Send response to JavaScript
    emit('receive_from_flask', data)
    
if __name__ == '__main__':
    train = Train()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
   


