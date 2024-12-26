import torch as th
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import numpy as np
import os

# Neural Network
class Linear_QNet(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.linear1 = nn.Linear(input_size, hidden_size) # input -> hidden layer
        self.linear2 = nn.Linear(hidden_size, output_size) # hidden layer -> output

    def forward(self, x): # Executes the network
        x = F.relu(self.linear1(x))
        x = self.linear2(x)
        return x

    def save(self, file_name='model.pth'): # Save trained model
        model_folder_path = './model'
        if not os.path.exists(model_folder_path):
            os.makedirs(model_folder_path)
            
        file_name = os.path.join(model_folder_path, file_name)
        th.save(self.state_dict(), file_name)

    def load(self, file_name='model.pth'):
        model_folder_path = './model'
        file_name = os.path.join(model_folder_path, file_name)

        # Load the model state_dict from the file
        if os.path.exists(file_name):
            self.load_state_dict(th.load(file_name, weights_only=True))
            self.eval()
            print(f"Model loaded from {file_name}")
        else:
            print(f"No model found at {file_name}")


class QTrainer:
    def __init__(self, model,target_model, lr, gamma):
        self.lr = lr
        self.gamma = gamma
        self.model = model
        self.target_model = target_model
        self.optimizer = optim.Adam(model.parameters(), lr=self.lr)
        self.criterion = nn.MSELoss()

    def train_step(self, state, action, reward, next_state, done):
        state = th.tensor(np.array(state), dtype=th.float)
        next_state = th.tensor(np.array(next_state), dtype=th.float)
        action = th.tensor(np.array(action), dtype=th.long)
        reward = th.tensor(np.array(reward), dtype=th.float)

        # (n, x)

        if len(state.shape) == 1:
            # (1, x)
            state = th.unsqueeze(state, 0)
            next_state = th.unsqueeze(next_state, 0)
            action = th.unsqueeze(action, 0)
            reward = th.unsqueeze(reward, 0)
            done = (done, )


        # 1: predicted Q values with current state
        pred = self.model(state)

        # Compute target Q values
        target_Q = pred.clone().detach()

        # Create a copy of target_Q to avoid in-place modification
        target_Q_new = target_Q.clone()

        for idx in range(len(done)):
            if not done[idx]:
                # If not done, include the discounted future reward
                next_Q = self.model(next_state[idx])
                max_next_Q = th.max(next_Q)
                target_Q_new[idx][th.argmax(action[idx])] = reward[idx] + self.gamma * max_next_Q
            else:
                # If done, only include the immediate reward
                target_Q_new[idx][th.argmax(action[idx])] = reward[idx]
    
        # 2: Q_new = r + y * max(next_predicted Q value) -> only do this if not done
        # pred.clone()
        # preds[argmax(action)] = Q_new
        self.optimizer.zero_grad()
        loss = self.criterion(target_Q_new, pred)
        loss.backward()

        self.optimizer.step()

    def update_target(self):
        self.target_model.load_state_dict(self.model.state_dict())