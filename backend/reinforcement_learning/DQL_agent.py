import torch as th
import random
import numpy as np
from collections import deque, namedtuple
from reinforcement_learning.DQL_model import Linear_QNet, QTrainer

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001

class Direction:
    LEFT = 1
    RIGHT = 2
    UP = 3
    DOWN = 4

class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0
        self.gamma = 0.9
        self.memory = deque(maxlen=MAX_MEMORY)
        self.model = Linear_QNet(0, 256, 0) #Zeros are to be changed
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

    def get_state(self, game_data):

        tile_size = game_data['data']['environment']['tileSize']

        # NPC position and direction
        position_x = game_data['data']['state']['position']['x']
        position_y = game_data['data']['state']['position']['y']
        direction = game_data['data']['state']['direction']

        # Direction
        dir_l = direction == Direction.LEFT
        dir_r = direction == Direction.RIGHT
        dir_u = direction == Direction.UP
        dir_d = direction == Direction.DOWN

        # Crown position 
        crown_x = game_data['data']['crown']['position']['x']
        crown_y = game_data['data']['crown']['position']['y']


        # State
        state = [

            # Passable/Impassable tile
            game_data['data']['collision']['straight'], 
            game_data['data']['collision']['right'], 
            game_data['data']['collision']['left'], 


            # Move direction
            dir_l,
            dir_r,
            dir_u,
            dir_d,


            # Crown Position (Primary Objective)
            crown_x < position_x, # Left
            crown_x > position_x, # right
            crown_y < position_y, # up
            crown_y > position_y  # down

        ]
        
    
    def remember(self, state, action, reward, next_state, done):
        pass

    def train_long_memory(self):
        pass

    def train_short_memory(self, state, action, reward, next_state, done):
        pass

    def get_action(self, state):
        pass

def train(game_data):
    agent = Agent()
    # agent.get_state(game_data)
    print(game_data)
    
