class Enemy extends Sprite{
    constructor({ imgSrc, frameRate, imgSize, position, hitbox, animations }) {
        super({imgSrc, frameRate, animations})
        
        this.imgSize = imgSize;
        // Initial position
        this.position = { 
            x: position.x, 
            y: position.y
        }; 
        this.speed = 6
        this.velocity = {x: 0, y: 0}
        this.data = {}
        this.currentState = new EnemyIdleState(this);

        //Initialize Hitbox
        this.hitbox = {
            w: this.imgSize - (this.imgSize - hitbox.x),
            h: this.imgSize - (this.imgSize - hitbox.y)
        }
    }

    drawHitbox(){

        const newEnemyPosX = this.position.x + (this.imgSize - this.hitbox.w) / 2
        const newEnemyPosY = this.position.y + (this.imgSize - this.hitbox.h) / 2
        
        c.fillStyle = 'rgba(255,0,0,30%)';
        c.fillRect(newEnemyPosX, newEnemyPosY, this.hitbox.w, this.hitbox.h);
    }

    spriteAnimation(name){
        this.currentFrame = 0
        this.img = this.animations[name].img
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
    } 

    getData(){

        // Initializing JSON to be sent to backend
        this.data = {

            phase: phase,

            // Tile Passability
            collision: {
                right: passability[0],
                left: passability[1],
                up: passability[2],
                down: passability[3]
            },

            // Game state
            state: {
                position: this.position,
                playerPosition: player.position,
                direction: direction
            },
            
            reward: reward,
            score: score,
            gameOver: isGameOver
        }

    }

    decision() {

        // Get data
        this.getData()

        // Sends data to python flask with web socket
        sendData(this.data);

    }

    train(){

        //Re-evaluate tile passability and collisions
        this.checkPassability();

        // Get data
        this.getData();

        // Send another data to flask
        sendResponse(this.data);

        phase = 1;

        // New game
        if(isGameOver){
            isGameOver = !isGameOver;
            score = 0
            direction = 0;
            lastPlayerDirection = 3
        }

    }

    slayPlayer(){

        const isPlayerInRange = this.playerInRange();

        if(isPlayerInRange){
            isEnemyAttack = true

            if(enemyAttackFlag == 0) {
                this.setState(new EnemyAttackState(this));
                enemyAttackFlag = 1
            }
        }
    }

    playerInRange(){

        // New position x and y axis with consideration to the hitbox
        const newEnemyPosX = this.position.x + ((this.imgSize) - this.hitbox.w) / 2
        const newEnemyPosY = this.position.y + ((this.imgSize) - this.hitbox.h) / 2
        const newPlayerPosX = player.position.x + (tileSize - player.hitbox.w) / 2
        const newPlayerPosY = player.position.y + (tileSize - player.hitbox.h) / 2

        // Attack at the direction of the player
        if(newPlayerPosX >= newEnemyPosX + (this.hitbox.w / 2) && newPlayerPosX <= newEnemyPosX + this.hitbox.w) direction = 0;
        if(newPlayerPosX + player.hitbox.w >= newEnemyPosX && newPlayerPosX + player.hitbox.w <= newEnemyPosX + (this.hitbox.w / 2)) direction = 1;
        if(newPlayerPosY + player.hitbox.h >= newEnemyPosY && newPlayerPosY + player.hitbox.h <= newEnemyPosY + (this.hitbox.h / 2)) direction = 2;
        if(newPlayerPosY >= newEnemyPosY + (this.hitbox.h / 2) && newPlayerPosY <= newEnemyPosY + this.hitbox.h) direction = 3;

        return(
            // If enemy position x is greater than player position x
            // Check if enemy hit box collides with player hitbox
            (newEnemyPosX + this.hitbox.w >= newPlayerPosX && newEnemyPosX + this.hitbox.w <= newPlayerPosX + player.hitbox.w &&
            (newEnemyPosY + this.hitbox.h >= newPlayerPosY && newEnemyPosY + this.hitbox.h <= newPlayerPosY + player.hitbox.h ||
            newEnemyPosY >=  newPlayerPosY && newEnemyPosY <= newPlayerPosY + player.hitbox.h))

            ||

            // If player position x is greater than enemy position x
            // Check if player hit box collides with enemy hitbox
            (newPlayerPosX + player.hitbox.w >= newEnemyPosX && newPlayerPosX + player.hitbox.w <= newEnemyPosX + this.hitbox.w &&
            (newPlayerPosY + player.hitbox.h >= newEnemyPosY && newPlayerPosY + player.hitbox.h <= newEnemyPosY + this.hitbox.h ||
            newPlayerPosY >= newEnemyPosY && newPlayerPosY <= newEnemyPosY + this.hitbox.h))
        )

    }

    reset(){
        
        // Reset and give reward
        isGameOver = true;
        reward = 10;
        player.position.x = player.position.y = 0;

        if(steps > 100) score = 250;
        if(steps > 1000) score = 200;
        if(steps > 2000) score = 150;
        if(steps > 3000) score = 100;
        if(steps > 7000) score = 50;
        if(steps > 13000) score = 30;
        if(steps > 17000) score = 20;
        if(steps > 20000) score = 5;

        steps = 0; 
    }

    checkPassability() {

        passability = [];

        // Movement points 
        const point_right = {x: this.position.x - ((this.imgSize - this.hitbox.w) / 2) + this.speed, y: this.position.y};
        const point_left = {x: this.position.x + ((this.imgSize - this.hitbox.w) / 2) - this.speed, u: this.position.y};
        const point_up = {x: this.position.x, y: this.position.y + ((this.imgSize - this.hitbox.h) / 2) - this.speed};
        const point_down = {x: this.position.x, y: this.position.y - ((this.imgSize - this.hitbox.h) / 2) + this.speed};
    
        // right
        passability.push(point_right.x > canvas.width - (this.imgSize));
        
        // left
        passability.push(point_left.x < 0);

        // up
        passability.push(point_up.y < 5) ;    

        //down
        passability.push(point_down.y > canvas.height - (this.imgSize) - 30);

    }

    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }

    getStateFromAction(action){
        if (JSON.stringify(action) == JSON.stringify([1,0,0,0])) return new EnemyMoveRightState(this);
        if (JSON.stringify(action)  == JSON.stringify([0,1,0,0])) return new EnemyMoveLeftState(this);
        if (JSON.stringify(action)  == JSON.stringify([0,0,1,0])) return new EnemyMoveUpState(this);
        if (JSON.stringify(action)  == JSON.stringify([0,0,0,1])) return new EnemyMoveDownState(this);
        return new EnemyIdleState()
    }

    movementUpdate(){
        this.currentState.update();
        steps++
    }
}


// FINITE STATE MACHINE (FSM) IMPLEMENTATION

class EnemyFazedState extends State{
    enter(){
        
        this.entity.spriteAnimation('fazed')

    }
    
    update(){

        if( this.entity.currentFrame >= this.entity.frameRate - 1){

            isEnemyAttack = false;
            enemyAttackFlag = 0     
            this.entity.setState(this.entity.getStateFromAction(action));
            shadowEssence.setState(new PickObject(shadowEssence))
        }
    }
}

class EnemyAttackState extends State{
    enter(){

        const attack = ['attackRight', 'attackLeft', 'attackUp', 'attackDown']
        this.entity.spriteAnimation(attack[direction]);

    }
    update(){

        isParried && console.log('Parried Successfully')

        if(isParried){
            this.entity.setState(new EnemyFazedState(this.entity))
        }

        // Check if the attack animation is completed
        if (this.entity.currentFrame >= this.entity.frameRate - 1) {

            const isPlayerInRange = this.entity.playerInRange() 
            if(isPlayerInRange) this.entity.reset();

            isEnemyAttack = false;
            enemyAttackFlag = 0     
            this.entity.setState(this.entity.getStateFromAction(action));
        }
    }

}

class EnemyIdleState extends State {
    enter() {

        const idle = ['moveRight', 'moveLeft', 'moveUp', 'moveDown']
        this.entity.spriteAnimation(idle[direction])
        
    }

    update() {
        // No movement in idle state
    }
}

// Moving Left State
class EnemyMoveRightState extends State {
    enter() {

        direction = 0
        this.entity.spriteAnimation('moveRight');
        this.entity.velocity = { x: -this.entity.speed, y: 0 };
    }

    update() {
        
        if(this.entity.position.x - ((this.entity.imgSize - this.entity.hitbox.w) / 2) + this.entity.speed > canvas.width - (this.entity.imgSize)) reward = -10;
        else this.entity.position.x += this.entity.speed;
    }
}

// Moving Right State
class EnemyMoveLeftState extends State {
    enter() {

        direction = 1
        this.entity.spriteAnimation('moveLeft');
        this.entity.velocity = { x: this.entity.speed, y: 0 };
    }

    update() {

        if(this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2) - this.entity.speed < 0) reward = -10;
        else {
            this.entity.position.x -= this.entity.speed;
        }
    }
}

// Moving Up State
class EnemyMoveUpState extends State {
    enter() {

        direction = 2
        this.entity.spriteAnimation('moveUp');
        this.entity.velocity = { x: 0, y: -this.entity.speed };
    }

    update() {
        
        if(this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2) - this.entity.speed < -20) reward = -10;
        else {
            this.entity.position.y -= this.entity.speed;
        }
    }
}

// Moving Down State
class EnemyMoveDownState extends State {
    enter() {
        
        direction = 3
        this.entity.spriteAnimation('moveDown');
        this.entity.velocity = { x: 0, y: this.entity.speed };
    }

    update() {

        if(this.entity.position.y - ((this.entity.imgSize - this.entity.hitbox.h) / 2) + this.entity.speed > canvas.height - (this.entity.imgSize) - 20) reward = -10;
        else{
            this.entity.position.y += this.entity.speed;

        }
    }
}

