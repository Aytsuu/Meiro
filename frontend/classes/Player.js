class Player extends Sprite {
    constructor({ imgSrc, frameRate, imgSize, animations}) {
        super({ imgSrc, frameRate, imgSize, animations });

        this.imgSize = imgSize
        // Initial position
        this.position = { x: 0, y: 0};
        this.currentState = new IdleState(this); // Start with the idle state
        this.speed = 4; // Movement speed

        // Velocity to track movement direction
        this.velocity = { x: 0, y: 0 };

        // Initialize Hitbox
        this.hitbox = {
            w: this.imgSize - (this.imgSize - 30),
            h: this.imgSize - (this.imgSize - 50)
        }

    }

    focus(){ // Shadow casting

        const rect = canvas.getBoundingClientRect();
        let lightX = this.position.x + (this.imgSize / 2);
        let lightY = this.position.y + (this.imgSize / 2);

        // Create radial gradient for light
        const gradient = c.createRadialGradient(
            lightX, lightY, 150,
            lightX, lightY, 0
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');
        
        // Draw light
        c.save();
        c.globalCompositeOperation = 'darker';
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(lightX, lightY, 2000, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }

    drawHitbox(){
        const newPlayerPosX = this.position.x + (this.imgSize - this.hitbox.w) / 2
        const newPlayerPosY = this.position.y + (this.imgSize - this.hitbox.h) / 2
        
        c.fillStyle = 'rgba(255,0,0,30%)';
        c.fillRect(newPlayerPosX, newPlayerPosY, this.hitbox.w, this.hitbox.h);
    }

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

    checkMazeCollision(currentPosition, newPosition, maze) {
        let size = canvas.height / maze.height;
        size = Math.round(size);
        let wallWidth = Math.ceil(size / 15); // Line width (wall thickness)
    
        // For each wall (each direction in maze), check if the character's movement intersects the wall
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                let node = maze.map[y][x];
                let xPos = x * size + size / 2;
                let yPos = y * size + size / 2;
    
                // Get the line segment representing the wall
                let wallX = xPos + node.direction.x * size;
                let wallY = yPos + node.direction.y * size;
    
                // Calculate bounding box for the wall (rectangle with width equal to line width)
                let wallBoundingBox = {
                    x: Math.min(xPos, wallX) - wallWidth / 2,
                    y: Math.min(yPos, wallY) - wallWidth / 2,
                    width: Math.abs(wallX - xPos) + wallWidth,
                    height: Math.abs(wallY - yPos) + wallWidth
                };
    
                // Calculate bounding box for the player
                let playerBoundingBox = {
                    x: Math.min(currentPosition.x, newPosition.x),
                    y: Math.min(currentPosition.y, newPosition.y),
                    width: Math.abs(newPosition.x - currentPosition.x) + this.hitbox.w,
                    height: Math.abs(newPosition.y - currentPosition.y) + this.hitbox.h
                };
    
                // Check if the player's bounding box intersects with the wall's bounding box
                if (this.checkBoundingBoxCollision(playerBoundingBox, wallBoundingBox)) {
                    return true; // Collision
                }
    
            }
        }
        return false; // No collision
    }

    // Function to check if two bounding boxes intersect
    checkBoundingBoxCollision(box1, box2) {
        return (
            box1.x <= box2.x + box2.width &&
            box1.x + box1.width >= box2.x &&
            box1.y <= box2.y + box2.height &&
            box1.y + box1.height >= box2.y
        );
    }
}

class AttackState extends State {
    enter() {

        const attack = ['attackRight', 'attackLeft', 'attackUp', 'attackDown']
        this.entity.spriteAnimation(attack[lastPlayerDirection])

    }

    update() {

        if(isEnemyAttack && this.entity.currentFrame == 4 && enemy.currentFrame == 14) isParried = true;

        if(this.entity.currentFrame >= this.entity.frameRate - 1) this.entity.setState(new IdleState(this.entity));

    }
}

// Idle State
class IdleState extends State {
    enter() {

        const idle = ['idleRight', 'idleLeft', 'idleUp', 'idleDown']
        this.entity.spriteAnimation(idle[lastPlayerDirection])

    }

    handleInput() {
        if (keys.w.pressed) this.entity.setState(new MoveUpState(this.entity));
        else if (keys.a.pressed) this.entity.setState(new MoveLeftState(this.entity));
        else if (keys.s.pressed) this.entity.setState(new MoveDownState(this.entity));
        else if (keys.d.pressed) this.entity.setState(new MoveRightState(this.entity));
        else if (keys.sp.pressed) this.entity.setState(new AttackState(this.entity));
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

        const currentPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2), 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2)
        }

        const newPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2) + this.entity.velocity.x - 5, 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2)
        }

        // Check collision on walls
        if(this.entity.checkMazeCollision(currentPosition, newPosition, maze)) return;
        
        // Check collision on canvas boundary
        if(newPosition.x > 8){
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

        const currentPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2), 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2) 
        }

        const newPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2) + this.entity.velocity.x + 5, 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2)
        }

        // Check collision on walls
        if(this.entity.checkMazeCollision(currentPosition, newPosition, maze)) return;

        // Check collision on canvas boundary
        if(this.entity.position.x - ((this.entity.imgSize - this.entity.hitbox.w) / 2) + this.entity.velocity.x < canvas.width - this.entity.imgSize - 5){
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

        const currentPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2), 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2)
        }

        const newPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2), 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2) + this.entity.velocity.y
        }

        // Check collision on walls
        if(this.entity.checkMazeCollision(currentPosition, newPosition, maze)) return;
        
        // Check collision on canvas boundary
        if(newPosition.y > 0){
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
        
        const currentPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2), 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2)
        }

        const newPosition = {
            x: this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2), 
            y: this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2) + this.entity.velocity.y + 10
        }

        // Check collision on walls
        if(this.entity.checkMazeCollision(currentPosition, newPosition, maze)) return;

        // Check collision on canvas boundary
        if(this.entity.position.y - ((this.entity.imgSize - this.entity.hitbox.h) / 2) + this.entity.velocity.y < canvas.height - this.entity.imgSize - 15){
            this.entity.position.y += this.entity.velocity.y;
        }
    }
}
