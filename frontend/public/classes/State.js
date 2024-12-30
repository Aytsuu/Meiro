// Base State Class
class State {
    constructor(entity) {
        this.entity = entity;
    }

    enter() {}  // Called when entering the state
    exit() {}   // Called when exiting the state
    handleInput() {} // Handle user input in this state
    update() {}  // Update logic for the state
}