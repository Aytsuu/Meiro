class Enemy extends Sprite{
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})
        
        // Initial position
        this.position = { 
            x: 0, 
            y: canvas.height - tileSize
        }; 

        this.speed = 4
        this.data = {}

        // Hitbox
        this.hitbox = {
            w: tileSize - (tileSize - 34),
            h: tileSize - (tileSize - 50)
        }

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

    action(){
        // Returned data could be...
        // [1,0,0,0] - right
        // [0,1,0,0] - left
        // [0,0,1,0] - up
        // [0,0,0,1] - down

        if(JSON.stringify(action) == JSON.stringify([1,0,0,0])){ // If right

            // Update direction, position and reward
            direction = 0
            if(this.position.x + tileSize > canvas.width - tileSize) reward = -10;
            else this.position.x += this.speed;

        }
        else if(JSON.stringify(action)  == JSON.stringify([0,1,0,0])){ // If left
            
            // Update direction, position and reward
            direction = 1
            if(this.position.x - tileSize < 0) reward = -10;
            else {
                this.position.x -= this.speed;
            }
            
        }
        else if(JSON.stringify(action)  == JSON.stringify([0,0,1,0])){ // If up

            // Update direction, position and reward
            direction = 2
            if(this.position.y - tileSize < 0) reward = -10;
            else {
                this.position.y -= this.speed;
            }

        }
        else{ // If down

            // Update direction, position and reward
            direction = 3
            if(this.position.y + tileSize > canvas.height - tileSize) reward = -10;
            else{
                this.position.y += this.speed;

            }

        }

        steps++

        // 2nd training phase
        // this.moveTrainingPhase();
    }

    train(){
        
        // Kill player
        this.slayPlayer();

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
            player.position.x = player.position.y = 0;
            this.position.x = 0;
            this.position.y = canvas.height - tileSize;
        }

    }

    slayPlayer(){

        const isNearPlayer = [

            // Player is at the right of the NPC
            player.position.x > this.position.x && 
            (this.position.x + (tileSize - this.hitbox.w) / 2),
            
            //

        ]

        if(isNearPlayer.some(coords => coords == 50)) {

            // Reset and give reward
            isGameOver = true;
            reward = 5;
            this.position.x = 0;
            this.position.y = canvas.height - tileSize;
            score = Math.floor(steps / 5);
            steps = 0; 
        }
    }

    checkPassability() {

        passability = [];

        // Movement points 
        const point_right = {x: this.position.x + tileSize, y: this.position.y};
        const point_left = {x: this.position.x - tileSize, u: this.position.y};
        const point_up = {x: this.position.x, y: this.position.y - tileSize};
        const point_down = {x: this.position.x, y: this.position.y + tileSize};
    
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
                position.x > canvas.width - tileSize ||
                position.y < 0 ||
                position.y > canvas.height - tileSize)

    }
}
