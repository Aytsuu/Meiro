import eventlet
eventlet.monkey_patch()  # Monkey-patch to make the standard library compatible with async

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from DQN_agent import Train
import logging
# from concurrent.futures import ThreadPoolExecutor
from engineio.payload import Payload
from eventlet import GreenPool

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
Payload.max_decode_packets = 500

train = None
train_instances = {i: Train() for i in range(2)}

# Set up a gree pool
green_pool = GreenPool()

def train_in_background(game_data, train_instance, ai_id): 

    try:
        if game_data['phase'] == 1:
            final_move, phase = train_instance.first_training(game_data)

            data = {
                'action': final_move,
                'phase': phase,
                'aiId': ai_id
            }

            socketio.emit('receive_from_flask', data)
        else:
            train_instance.second_training(game_data)

    except Exception as e:
        print(f"Error during training: {e}")
        final_move = None
        phase = "Error"

@socketio.on('send_to_flask')
def handle_send_to_flask(data):

    # Training multiple AI using multi-training instances
    ai_id = data.get('aiId')

    if ai_id is not None and ai_id in train_instances:
        train_instance = train_instances[ai_id]

    # Use the green pool to manage background tasks
    green_pool.spawn(train_in_background, data, train_instance, ai_id)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
 

