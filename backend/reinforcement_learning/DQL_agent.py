import torch as th
import random
import numpy as np
from collections import deque
from reinforcement_learning.DQL_model import Linear_QNet, QTrainer

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001

class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0
        self.gamma = 0.9
        self.memory = deque(maxlen=MAX_MEMORY)
        self.model = Linear_QNet(0, 256, 0) #Zeros are to be changed
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

    def get_state(self, gameData):
        pass
    
    def remember(self, state, action, reward, next_state, done):
        pass

    def train_long_memory(self):
        pass

    def train_short_memory(self, state, action, reward, next_state, done):
        pass

    def get_action(self, state):
        pass

def train(game_data):
    pass
