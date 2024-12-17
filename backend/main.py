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

    # Get data sent from JavaScript (POST request)
    game_data = data

    final_move = train.first_training(game_data)

    print(final_move)

    # Send response to JavaScript
    emit('receive_from_flask', final_move)
    
if __name__ == '__main__':
    train = Train()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
   


