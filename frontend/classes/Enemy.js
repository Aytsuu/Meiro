class Enemy extends Sprite{
    constructor({ imgSrc, frameRate, role, animations }) {
        super({imgSrc, frameRate, role, animations})
        
        // Initial position
        this.position = { 
            x: canvas.width - (tileSize * 2), 
            y: canvas.height - (tileSize * 2)
        }; 

        this.speed = 6
        this.velocity = {x: 0, y: 0}
        this.data = {}
        this.currentState = new EnemyIdleState(this);

        //Initialize Hitbox
        this.hitbox = {
            w: (tileSize * 2) - ((tileSize * 2) - 100),
            h: (tileSize * 2) - ((tileSize * 2) - 120)
        }
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

        const newEnemyPosX = this.position.x + ((tileSize * 2) - this.hitbox.w) / 2
        const newEnemyPosY = this.position.y + ((tileSize * 2) - this.hitbox.h) / 2
        const newPlayerPosX = player.position.x + (tileSize - player.hitbox.w) / 2
        const newPlayerPosY = player.position.y + (tileSize - player.hitbox.h) / 2

        if(
            // If enemey position x is greater than player position x
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

        ) {

            // Reset and give reward
            isGameOver = true;
            reward = 10;
            this.position.x = canvas.width - (tileSize * 2);
            this.position.y = canvas.height - (tileSize * 2);
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
    }

    checkPassability() {

        passability = [];

        // Movement points 
        const point_right = {x: this.position.x + (tileSize * 2), y: this.position.y};
        const point_left = {x: this.position.x - (tileSize * 2), u: this.position.y};
        const point_up = {x: this.position.x, y: this.position.y - (tileSize * 2)};
        const point_down = {x: this.position.x, y: this.position.y + (tileSize * 2)};
    
        // right
        passability.push(this.collisionDetection(point_right));
        
        // left
        passability.push(this.collisionDetection(point_left));

        // up
        passability.push(this.collisionDetection(point_up));

        //down
        passability.push(this.collisionDetection(point_down));

    }

    collisionDetection(position) { // Check collision

        return (obstacles.some(obstacle => position.x == obstacle.x && position.y == obstacle.y) || 
                position.x < 0 ||
                position.x > canvas.width - (tileSize * 2)||
                position.y < 0 ||
                position.y > canvas.height - (tileSize * 2))

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

    action(){
        // this.currentState.handleInput();
        this.currentState.update();
        steps++
        console.log(steps)
    }
}


// FINITE STATE MACHINE (FSM) IMPLEMENTATION

class EnemyIdleState extends State {
    enter() {

        const idle = ['moveRight', 'moveLeft', 'moveUp', 'moveDown']
        this.entity.spriteAnimation(idle[direction])
        this.entity.velocity = { x: 0, y: 0 }; // Stop movement
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
        
        if(this.entity.position.x - ((tileSize * 2 - this.entity.hitbox.w) / 2) + this.entity.speed > canvas.width - (tileSize * 2)) reward = -10;
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

        if(this.entity.position.x + ((tileSize * 2 - this.entity.hitbox.w) / 2) - this.entity.speed < 0) reward = -10;
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
        
        if(this.entity.position.y + ((tileSize * 2 - this.entity.hitbox.h) / 2) - this.entity.speed < 5) reward = -10;
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

        if(this.entity.position.y - ((tileSize * 2 - this.entity.hitbox.h) / 2) + this.entity.speed > canvas.height - (tileSize * 2) - 30) reward = -10;
        else{
            this.entity.position.y += this.entity.speed;

        }
    }
}

