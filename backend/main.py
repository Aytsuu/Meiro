from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from DQN_agent import Train
from threading import Lock

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins

train_lock = Lock()
train = None

# Route to serve the HTML page with JavaScript
@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('send_to_flask')
def handle_send_to_flask(data):
    
    final_move = None
    phase = None

    # Handle the training phases
    game_data = data
    if game_data['phase'] == 1:
        final_move, phase = train.first_training(game_data)
    else:
        print('MOVED TO 2ND PHASE')
        train.second_training(game_data)
    
    # Send the response back to JavaScript
    data = {
        'action': final_move,
        'phase': phase
    }
    emit('receive_from_flask', data)

if __name__ == '__main__':
    train = Train()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
 

