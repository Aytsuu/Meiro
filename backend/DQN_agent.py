import torch as th
import random
import numpy as np
from collections import deque
from DQN_model import Linear_QNet, QTrainer

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
        self.model = Linear_QNet(11, 256, 3)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

    def get_state(self, game_data):

        # tile_size = game_data['data']['environment']['tileSize']

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
        crown_x = game_data['data']['state']['crownPosition']['x']
        crown_y = game_data['data']['state']['crownPosition']['y']


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
        
        return np.array(state,dtype=int)
    
    def remember(self, state, action, reward, next_state, done):

        self.memory.append((state, action, reward, next_state, done))

    def train_long_memory(self):

        if len(self.memory) > BATCH_SIZE:
            mini_sample = random.sample(self.memory, BATCH_SIZE)
        else:
            mini_sample = self.memory
        
        states, actions, rewards, next_states, dones = zip(*mini_sample)
        self.trainer.train_step(states, actions, rewards, next_states, dones)

    def train_short_memory(self, state, action, reward, next_state, done):

        self.trainer.train_step(state, action, reward, next_state, done)

    def get_action(self, state):

        # random moves: tradeoff exploration / exploitation
        self.epsilon = 80 - self.n_games
        final_move = [0,0,0]
        if random.randint(0, 200) < self.epsilon:
            move = random.randint(0, 2)
            final_move[move] = 1
        else:
            state0 = th.tensor(state, dtype=th.float)
            prediction = self.model(state0)
            move = th.argmax(prediction).item()
            final_move[move] = 1
        
        return final_move

class Train:

    def __init__(self):
        
        self.plot_scores = []
        self.plot_mean_scores = []
        self.total_score = 0
        self.record = 0
        self.agent = Agent()

        self.state_old = None
        self.final_move = None

        self.state_new = None
        self.reward = None
        self.done = False


    def first_training(self, game_data):
            
        # Get old state
        self.state_old = self.agent.get_state(game_data)

        # Get move
        self.final_move = self.agent.get_action(self.state_old)

        return self.final_move
        
    def second_training(self, game_data):

        # Perform move and get new state
        self.reward = game_data['data']['reward']
        self.done = game_data['data']['gameOver']
        state_new = self.agent.get_state(game_data)

        # train short memory
        self.agent.train_short_memory(self.state_old, self.final_move, self.reward, state_new, self.done)

        # remember
        self.agent.remember(self.state_old, self.final_move, self.reward, state_new, self.done)