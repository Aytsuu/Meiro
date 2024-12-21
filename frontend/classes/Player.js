
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
        
//                 // Check if the entity reached the target point
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
    constructor({ imgSrc, frameRate, role, animations}) {
        super({ imgSrc, frameRate, role, animations });

        // Initial position
        this.position = { x: 0, y: 0};
        this.currentState = new IdleState(this); // Start with the idle state
        this.speed = 3.5; // Movement speed

        // Velocity to track movement direction
        this.velocity = { x: 0, y: 0 };

        // Hitbox
        this.hitbox = {
            w: tileSize - (tileSize - 27),
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

    spriteAnimation(name){
        this.currentFrame = 0
        this.img = this.animations[name].img
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
    } 
}

// Idle State
class IdleState extends State {
    enter() {

        const idle = ['idleRight', 'idleLeft', 'idleUp', 'idleDown']

        this.entity.spriteAnimation(idle[lastPlayerDirection])
        this.entity.velocity = { x: 0, y: 0 }; // Stop movement
    }

    handleInput() {
        if (keys.w.pressed) this.entity.setState(new MoveUpState(this.entity));
        else if (keys.a.pressed) this.entity.setState(new MoveLeftState(this.entity));
        else if (keys.s.pressed) this.entity.setState(new MoveDownState(this.entity));
        else if (keys.d.pressed) this.entity.setState(new MoveRightState(this.entity));
    }

    update() {
        // No movement in idle state
    }
}


// FINITE STATE MACHINE (FSM) IMPLEMENTATION

// Moving Left State
class MoveLeftState extends State {
    enter() {

        lastPlayerDirection = 1
        this.entity.spriteAnimation('moveLeft');
        this.entity.velocity = { x: -this.entity.speed, y: 0 };
    }

    handleInput() {
        if (!keys.a.pressed) this.entity.setState(new IdleState(this.entity));
    }

    update() {
        
        if(this.entity.position.x + ((tileSize - this.entity.hitbox.w) / 2) + this.entity.velocity.x > 5){
            this.entity.position.x += this.entity.velocity.x;
        }
    }
}

// Moving Right State
class MoveRightState extends State {
    enter() {

        lastPlayerDirection = 0
        this.entity.spriteAnimation('moveRight');
        this.entity.velocity = { x: this.entity.speed, y: 0 };
    }

    handleInput() {
        if (!keys.d.pressed) this.entity.setState(new IdleState(this.entity));
    }

    update() {

        if(this.entity.position.x - ((tileSize - this.entity.hitbox.w) / 2) + this.entity.velocity.x < canvas.width - tileSize - 5){
            this.entity.position.x += this.entity.velocity.x;
        }
    }
}

// Moving Up State
class MoveUpState extends State {
    enter() {

        lastPlayerDirection = 2
        this.entity.spriteAnimation('moveUp');
        this.entity.velocity = { x: 0, y: -this.entity.speed };
    }

    handleInput() {
        if (!keys.w.pressed) this.entity.setState(new IdleState(this.entity));
    }

    update() {
        
        if(this.entity.position.y + ((tileSize - this.entity.hitbox.h) / 2) + this.entity.velocity.y > 0){
            this.entity.position.y += this.entity.velocity.y;
        }
    }
}

// Moving Down State
class MoveDownState extends State {
    enter() {
        
        lastPlayerDirection = 3
        this.entity.spriteAnimation('moveDown');
        this.entity.velocity = { x: 0, y: this.entity.speed };
    }

    handleInput() {
        if (!keys.s.pressed) this.entity.setState(new IdleState(this.entity));
    }

    update() {

        if(this.entity.position.y - ((tileSize - this.entity.hitbox.h) / 2) + this.entity.velocity.y < canvas.height - tileSize - 20){
            this.entity.position.y += this.entity.velocity.y;
        }
    }
}
