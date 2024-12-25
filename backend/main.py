import eventlet
eventlet.monkey_patch()  # Monkey-patch to make the standard library compatible with async

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from DQN_agent import Train
import logging
from concurrent.futures import ThreadPoolExecutor
from engineio.payload import Payload

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
Payload.max_decode_packets = 500

train = None

# Set up a thread pool executor with a maximum of 4 threads
executor = ThreadPoolExecutor(max_workers=4)

def train_in_background(game_data): 

    try:
        if game_data['phase'] == 1:
            final_move, phase = train.first_training(game_data)

            data = {
                'action': final_move,
                'phase': phase
            }

            socketio.emit('receive_from_flask', data)
        else:
            train.second_training(game_data)

    except Exception as e:
        print(f"Error during training: {e}")
        final_move = None
        phase = "Error"

@socketio.on('send_to_flask')
def handle_send_to_flask(data):

    # Use the thread pool to manage background tasks
    executor.submit(train_in_background, data)

if __name__ == '__main__':
    train = Train()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
 

