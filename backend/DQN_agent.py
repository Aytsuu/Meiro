import torch as th
import random
import numpy as np
from collections import deque
from DQN_model import Linear_QNet, QTrainer

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001
GAMMA = 0.9

class Direction:
    RIGHT = 0
    LEFT = 1
    UP = 2
    DOWN = 3

class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0 # randomness
        self.memory = deque(maxlen=MAX_MEMORY)
        self.model = Linear_QNet(12, 64, 4)
        self.trainer = QTrainer(self.model, self.model, lr=LR, gamma=GAMMA)

    def get_state(self, game_data):

        # NPC position and direction
        position_x = game_data['state']['position']['x']
        position_y = game_data['state']['position']['y']
        direction = game_data['state']['direction']

        # Direction
        dir_l = direction == Direction.LEFT
        dir_r = direction == Direction.RIGHT
        dir_u = direction == Direction.UP
        dir_d = direction == Direction.DOWN

        # Player position 
        player_x = game_data['state']['playerPosition']['x']
        player_y = game_data['state']['playerPosition']['y']
    

        # State
        state = [

            # Passable/Impassable tile
            game_data['collision']['right'], 
            game_data['collision']['left'], 
            game_data['collision']['up'], 
            game_data['collision']['down'], 


            # Move direction
            dir_r,
            dir_l,
            dir_u,
            dir_d,


            # Crown Position (Primary Objective)
            player_x >= position_x, # right
            player_x <= position_x, # left
            player_y <= position_y, # up
            player_y >= position_y  # down

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
        final_move = [0,0,0,0]
        rand = random.randint(0,200)

        if rand < self.epsilon:
            move = random.randint(0, 3)
            final_move[move] = 1
        else:
            state0 = th.tensor(state, dtype=th.float).unsqueeze(0)
            prediction = self.model(state0)
            move = th.argmax(prediction).item()
            final_move[move] = 1
        
        return final_move

class Train:

    def __init__(self):

        self.agent = Agent()

        # Loading previously trained model to continue the training
        self.agent.model.load()
        
        self.plot_scores = []
        self.plot_mean_scores = []
        self.record = 0

        self.state_old = None
        self.final_move = None

        self.state_new = None
        self.reward = None
        self.done = False
        self.score = 0
        self.total_score = 0

        # Initialize target model (a copy of the Q-network)
        self.target_model = Linear_QNet(12, 64, 4)
        self.trainer = QTrainer(self.agent.model, self.target_model, lr=LR, gamma=GAMMA)

    def first_training(self, game_data):
    
        # Get old state
        self.state_old = self.agent.get_state(game_data)

        # Get move
        self.final_move = self.agent.get_action(self.state_old)

        return self.final_move, 2
        
    def second_training(self, game_data):

        # if self.steps_since_last_training >= self.train_interval:
        # Perform move and get new state
        state_new = self.agent.get_state(game_data)

        self.reward = game_data['reward']
        self.done = game_data['gameOver']
        self.score = game_data['score']

        # train short memory
        self.agent.train_short_memory(self.state_old, self.final_move, self.reward, state_new, self.done)

        # remember
        self.agent.remember(self.state_old, self.final_move, self.reward, state_new, self.done)

        if self.done:       

            # train long memory, plot result
            self.agent.n_games += 1
            self.agent.train_long_memory()

            if self.score > self.record:
                self.record = self.score
                self.agent.model.save()

            if self.agent.n_games % 10 == 0:
                self.trainer.update_target()

            print('Game', self.agent.n_games, 'Score', self.score, 'Record:', self.record)

