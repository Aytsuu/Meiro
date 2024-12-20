
// class Player extends Sprite{
//     constructor({ imgSrc, frameRate }) {
//         super({imgSrc, frameRate})
        
//         // Initial position
//         this.position = { 
//             x: 0, 
//             y: 0 
//         }; 

//         this.currentTargetIndex = 0; // Index of the current target in the path

//     }


//     movementUpdate() {

//         if (setMove && !isEnemyTurn && path.length > this.currentTargetIndex) {

//             const target = path[this.currentTargetIndex];
//             const lerpSpeed = 0.2; // Speed for smooth movement

//             // Target point
//             const targetPointX = (target.x - this.position.x)
//             const targePointY = (target.y - this.position.y)


//             // Object collision detection
            
//             if (obstacles.some(obstacle => this.position.x + targetPointX === obstacle.x && this.position.y + targePointY === obstacle.y)){

//                 console.log('object detected')
//                 setMove = false;
//                 this.currentTargetIndex = 0;
//                 path = []; // Clear the path
//                 isEnemyTurn = true

//             }else{

//                 // Move toward the target point
//                 this.position.x += targetPointX * lerpSpeed;
//                 this.position.y += targePointY * lerpSpeed;
        
//                 // Check if the player reached the target point
//                 if (
//                     Math.abs(this.position.x - target.x) < 1 &&
//                     Math.abs(this.position.y - target.y) < 1
//                 ) {

//                     this.position.x = target.x;
//                     this.position.y = target.y;
        
//                     // Move to the next target point
//                     this.currentTargetIndex++;
        
//                     // If the end of the path is reached, stop moving and clear the path
//                     if (this.currentTargetIndex >= path.length) {
//                         setMove = false;
//                         this.currentTargetIndex = 0;
//                         path = []; // Clear the path
//                         isEnemyTurn = true
//                     }
//                 }
//             }

//         }
//     }

//     // Highlight turns
//     isTurn(){
        
//         const borderWidth = 3;
//         c.strokeStyle = 'green';
//         c.lineWidth = borderWidth;
//         c.strokeRect(this.position.x + borderWidth / 2,this.position.y + borderWidth / 2, tileSize - borderWidth, tileSize - borderWidth);
//     }
// }

class Player extends Sprite {
    constructor({ imgSrc, frameRate }) {
        super({ imgSrc, frameRate });

        // Initial position
        this.position = { x: 0, y: 0};
        this.currentState = new IdleState(this); // Start with the idle state
        this.speed = 4; // Movement speed

        // Velocity to track movement direction
        this.velocity = { x: 0, y: 0 };

        // Hitbox
        this.hitbox = {
            w: tileSize - (tileSize - 34),
            h: tileSize - (tileSize - 50)
        }
    }

    // border(){
    //     c.strokeStyle = "#00000";
    //     c.strokeRect(this.position.x, this.position.y, tileSize, tileSize);
    // }

    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }

    movementUpdate() {
        this.currentState.handleInput();
        this.currentState.update();
    }
}

// Base State Class
class State {
    constructor(player) {
        this.player = player;
    }

    enter() {}  // Called when entering the state
    exit() {}   // Called when exiting the state
    handleInput() {} // Handle user input in this state
    update() {}  // Update logic for the state
}

// Idle State
class IdleState extends State {
    enter() {
        this.player.velocity = { x: 0, y: 0 }; // Stop movement
    }

    handleInput() {
        if (keys.w.pressed) this.player.setState(new MoveUpState(this.player));
        else if (keys.a.pressed) this.player.setState(new MoveLeftState(this.player));
        else if (keys.s.pressed) this.player.setState(new MoveDownState(this.player));
        else if (keys.d.pressed) this.player.setState(new MoveRightState(this.player));
    }

    update() {
        // No movement in idle state
    }
}

// Moving Left State
class MoveLeftState extends State {
    enter() {
        this.player.velocity = { x: -this.player.speed, y: 0 };
    }

    handleInput() {
        if (!keys.a.pressed) this.player.setState(new IdleState(this.player));
    }

    update() {

        if(this.player.position.x + ((tileSize - this.player.hitbox.w) / 2) + this.player.velocity.x > 0){
            this.player.position.x += this.player.velocity.x;
        }
    }
}

// Moving Right State
class MoveRightState extends State {
    enter() {


        this.player.velocity = { x: this.player.speed, y: 0 };
    }

    handleInput() {
        if (!keys.d.pressed) this.player.setState(new IdleState(this.player));
    }

    update() {

        if(this.player.position.x - ((tileSize - this.player.hitbox.w) / 2) + this.player.velocity.x < canvas.width - tileSize){
            this.player.position.x += this.player.velocity.x;
        }
    }
}

// Moving Up State
class MoveUpState extends State {
    enter() {
        this.player.velocity = { x: 0, y: -this.player.speed };
    }

    handleInput() {
        if (!keys.w.pressed) this.player.setState(new IdleState(this.player));
    }

    update() {
        
        if(this.player.position.y + ((tileSize - this.player.hitbox.h) / 2) + this.player.velocity.y > 0){
            this.player.position.y += this.player.velocity.y;
        }
    }
}

// Moving Down State
class MoveDownState extends State {
    enter() {
        this.player.velocity = { x: 0, y: this.player.speed };
    }

    handleInput() {
        if (!keys.s.pressed) this.player.setState(new IdleState(this.player));
    }

    update() {

        if(this.player.position.y - ((tileSize - this.player.hitbox.h) / 2) + this.player.velocity.y < canvas.height - tileSize){
            this.player.position.y += this.player.velocity.y;
        }
    }
}
