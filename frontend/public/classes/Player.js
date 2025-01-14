class Player extends Sprite {
    constructor({ imgSrc, frameRate, imgSize, healthpoint, animations}) {
        super({ imgSrc, frameRate, animations });

        this.imgSize = imgSize
        // Initial position
        this.position = { x: 0, y: 0};
        this.currentState = new IdleState(this); // Start with the idle state
        this.speed = 15; // Movement speed

        // Healthbar
        this.barSize = {
            w: 50,
            h: 5
        }

        this.currentHealthpoint = healthpoint;
        this.totalHealthpoint = healthpoint;

        // Velocity to track movement direction
        this.velocity = { x: 0, y: 0 };

        // Initialize Hitbox
        this.hitbox = {
            w: 30,
            h: 50
        }

    }

    focus(){ // Shadow casting

        let lightX = this.position.x + (this.imgSize / 2);
        let lightY = this.position.y + (this.imgSize / 2);

        // Create radial gradient for light
        const gradient = c.createRadialGradient(
            lightX, lightY, 150,
            lightX, lightY, 0
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
        
        // Draw light
        c.save();
        c.globalCompositeOperation = 'darker';
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(lightX, lightY, 2000, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }

    drawDeathEffect(){

        let lightX = canvas.width / 2;
        let lightY = canvas.height / 2;

        // Create radial gradient for light
        const gradient = c.createRadialGradient(
            lightX, lightY, 1300,
            lightX, lightY, 0
        );

        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // Draw light
        c.save();
        c.globalCompositeOperation = 'darker';
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(lightX, lightY, 3000, 0, Math.PI * 2);
        c.fill();
        c.restore();

        if(playerKilledAudio.currentTime >= playerAttackAudio.duration){
            isPlayerKilled = false;
            player.position.x = 0;
            player.position.y = 0;
        }

    }

    drawHitbox(){
        const newPlayerPosX = this.position.x + (this.imgSize - this.hitbox.w) / 2
        const newPlayerPosY = this.position.y + (this.imgSize - this.hitbox.h) / 2
        
        c.fillStyle = 'rgba(255,0,0,30%)';
        c.fillRect(newPlayerPosX, newPlayerPosY, this.hitbox.w, this.hitbox.h);
    }

    drawHealthbar(){

        c.font = `8px Poppins`;
        c.fillStyle = '#FFFFFF'
        c.fillText(`${this.currentHealthpoint}/${this.totalHealthpoint}`, this.position.x + this.imgSize / 2 - 25 + this.barSize.w / 2, this.position.y + ((this.imgSize - this.hitbox.h) / 2) - this.barSize.h);

        c.strokeStyle = 'black'
        c.lineWidth = 2;
        c.fillStyle = 'green';
        c.strokeRect(this.position.x + this.imgSize / 2 - 25, this.position.y + ((this.imgSize - this.hitbox.h) / 2), 50, this.barSize.h)
        c.fillRect(this.position.x + this.imgSize / 2 - 25, this.position.y + ((this.imgSize - this.hitbox.h) / 2), this.barSize.w, this.barSize.h);


    }

    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }

    movementUpdate() {
        if(!isGamePaused){
            this.currentState.handleInput();
            this.currentState.update();
        }
    }

    spriteAnimation(name){
        // Switch animation
        this.currentFrame = 0;
        const animation = this.animations[name];

        this.img = animation.img;
        this.frameRate = animation.frameRate;
        this.frameBuffer = animation.frameBuffer;

        // Recalculate size after changing the image
        if(this.img.complete) {
            this.size.width = this.img.width / this.frameRate;
            this.size.height = this.img.height;
        } else {
            this.img.onload = () => {
                this.size.width = this.img.width / this.frameRate;
                this.size.height = this.img.height;
            }
        }
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
class AttackState extends State {
    enter() {

        const attack = ['attackRight', 'attackLeft', 'attackUp', 'attackDown']
        this.entity.spriteAnimation(attack[lastPlayerDirection])
        playerAttackAudio.play();

    }

    update() {

        if(playerAttackAudio.currentTime == playerAttackAudio.duration - 0.01) playerAttackAudio.currentTime = 0;

        for(let i in enemy){
            if(enemy[i].isAttack && this.entity.currentFrame == 4 && enemy[i].currentFrame == enemy[i].parryFrame) {
                
                parryAudio.play();

                enemy[i].audio.attack.pause();
                enemy[i].isParried = true;

                if(!essenceCollected && essence[i]) {
                    enemy[i].essenceDropped = true;
                    collectEssenceAudio.play();
                }
                totalParries++;
            }
        }

        // if(isEnemyAttack && this.entity.currentFrame == 4 && shadow.currentFrame == 14) isParried = true;

        if(this.entity.currentFrame >= this.entity.frameRate - 1) this.entity.setState(new IdleState(this.entity));

    }
}

// Moving Left State
class MoveLeftState extends State {
    enter() {

        lastPlayerDirection = 1
        this.entity.spriteAnimation('moveLeft');
        this.entity.velocity = { x: -this.entity.speed, y: 0 };
        playerRunAudio.play();
    }

    handleInput() {
        if (!keys.a.pressed) {
            playerRunAudio.pause();
            playerRunAudio.currentTime = 0.02;
            this.entity.setState(new IdleState(this.entity));
        }

    }

    update() {

        playerRunAudio.play();
        if(playerRunAudio.currentTime  == playerRunAudio.duration) playerRunAudio.currentTime = 0.02;

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
        if (!keys.d.pressed) {
            playerRunAudio.pause();
            playerRunAudio.currentTime = 0.02;
            this.entity.setState(new IdleState(this.entity));
        }
        
    }

    update() {

        playerRunAudio.play();
        if(playerRunAudio.currentTime  == playerRunAudio.duration) playerRunAudio.currentTime = 0.02;

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
        if (!keys.w.pressed) {
            playerRunAudio.pause();
            playerRunAudio.currentTime = 0.02;
            this.entity.setState(new IdleState(this.entity));
        }
    }

    update() {

        playerRunAudio.play();
        if(playerRunAudio.currentTime  == playerRunAudio.duration) playerRunAudio.currentTime = 0.02;

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
        playerRunAudio.play();
    }

    handleInput() {
        if (!keys.s.pressed) {
            playerRunAudio.pause();
            playerRunAudio.currentTime = 0.02;
            this.entity.setState(new IdleState(this.entity));
        }
    }

    update() {
        
        playerRunAudio.play();
        if(playerRunAudio.currentTime  == playerRunAudio.duration) playerRunAudio.currentTime = 0.02;

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
