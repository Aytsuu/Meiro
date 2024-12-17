import backend.DQN_agent1 as DQN_agent1
import main

class Data:
    
    GAMEDATA = None


class AI:

    def start(data):
        Data.GAMEDATA = data
        DQN_agent1.train()

    def play_step():
        pass 