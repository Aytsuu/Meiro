class Enemy extends Sprite{
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})
        
        // Initial position
        this.position = { 
            x: 0, 
            y: canvas.height - tileSize
        }; 

        this.data = {}

    }

    getData(){

        // Initializing JSON to be sent to backend
        this.data = {

            phase: phase,

            // Tile Passability
            collision: {
                straight: passability[0],
                right: passability[1],
                left: passability[2]
            },

            // Game environment 
            environment: {
                width: canvas.width,
                height: canvas.height,
                tileSize: tileSize
            },

            // Game state
            state: {
                position: this.position,
                crownPosition: crown.position,
                direction: direction
            },
            
            reward: reward,
            score: score,
            n_games: n_games,
            gameOver: isGameOver
        }

    }

    decision() {

        // Enemy's turn to move
        if(isEnemyTurn){
            
            // Get data
            this.getData()

            // Handling data from callback
            const handleReturnedDate = (returnedData) => {

                // Returned data could be...
                // [1,0,0] - straight
                // [0,1,0] - right
                // [0,0,1] - left

                // [Right, DOWN, LEFT, UP]
                const dir = [0, 3, 1, 2]   
                const action = JSON.stringify(returnedData.action);
                const idx = dir.indexOf(direction)
                let new_dir = 0;

                phase = returnedData.phase
                console.log('Current direction', direction)

                if(action == JSON.stringify([1,0,0])){ // If straight
                    new_dir = direction
                    console.log('straight', new_dir)
                }
                else if(action == JSON.stringify([0,1,0])){ // If right
                    const next_idx = (idx + 1) % 4 
                    new_dir = dir[next_idx]
                    console.log('right', new_dir, 'index', next_idx)
                }
                else{ // If left
                    const next_idx = ((idx - 1) % 4 + 4) % 4
                    new_dir = dir[next_idx]
                    console.log('left', new_dir, 'index', next_idx)
                }

                this.movementUpdate(new_dir)

            }

            // Sends data to python flask with web socket
            sendData(this.data, handleReturnedDate);
        }

    }

    movementUpdate(new_dir) {     

        // Set new direction
        direction = new_dir

        console.log('New direction', direction)

        // Move right left up down
        if(new_dir == 0){
            // if(this.position.x + tileSize < canvas.width - tileSize)
            this.position.x += tileSize;
        }
        else if(new_dir == 1){
            // if(this.position.x - tileSize >= 0) this.position.x -= tileSize
            this.position.x -= tileSize;
        }
        else if(new_dir == 2){
            // if(this.position.y - tileSize >= 0) this.position.y -= tileSize
            this.position.y -= tileSize;
        }
        else{
            // if(this.position.y + tileSize < canvas.height - tileSize) this.position.y += tileSize
            this.position.y += tileSize;
        }

        // Exceeds the tile boundary
        this.isOutbound();

        // Takes the crown
        this.isTheKing();

        // 2nd training phase
        this.moveTrainingPhase();

    }

    moveTrainingPhase(){

        isEnemyTurn = false; // Change turn

        //Re-evaluate tile passability and collisions
        this.checkPassability();

        // Get data
        this.getData();

        // Send another data to flask
        sendResponse(this.data)

        // New game
        isGameOver = false
        phase = 1

    }

    // Highlight turns
    isTurn(){

        const borderWidth = 3;
        c.strokeStyle = 'red';
        c.lineWidth = borderWidth;
        c.strokeRect(this.position.x + borderWidth / 2,this.position.y + borderWidth / 2, tileSize - borderWidth, tileSize - borderWidth);
    
    }

    isTheKing(){

        if(this.position.x == crown.position.x && this.position.y == crown.position.y) {
            score++
            this.reset(1)
        }

    }

    isOutbound(){

        if(this.position.x < 0 || this.position.x > canvas.width - tileSize ||
            this.position.y < 0 || this.position.y > canvas.height - tileSize
        ){
            this.reset(-1)
        }
        
    }

    reset(result){

        // Reset game data
        if(result == -1){
            isGameOver = true;
            reward = -10;
        }
        else reward = 10;
        
        direction = 0;
        this.position.x = 0;
        this.position.y = canvas.height - tileSize;
        player.position.x = player.position.y = 0;
    }

    checkPassability() {

        // Movement points 
        const point_right = {x: this.position.x + tileSize, y: this.position.y}
        const point_left = {x: this.position.x - tileSize, u: this.position.y}
        const point_up = {x: this.position.x, y: this.position.y - tileSize}
        const point_down = {x: this.position.x, y: this.position.y + tileSize}
    
        passability = [
    
            // Straight
            direction == 0 && this.collisionDetection(point_right) ||
            direction == 1 && this.collisionDetection(point_left) ||
            direction == 2 && this.collisionDetection(point_up) ||
            direction == 3 && this.collisionDetection(point_down),
            
            // Right
            direction == 0 && this.collisionDetection(point_down) ||
            direction == 1 && this.collisionDetection(point_up) ||
            direction == 2 && this.collisionDetection(point_right) ||
            direction == 3 && this.collisionDetection(point_left),

            // Left
            direction == 0 && this.collisionDetection(point_up) ||
            direction == 1 && this.collisionDetection(point_down) ||
            direction == 2 && this.collisionDetection(point_left) ||
            direction == 3 && this.collisionDetection(point_right),

        ]
    
    }

    collisionDetection(position) { // Check collision 

        return obstacles.some(obstacle => position.x == obstacle.x && position.y == obstacle.y) || 
                position.x < 0 ||
                position.x > canvas.width - tileSize ||
                position.y < 0 ||
                position.y > canvas.height - tileSize

    }
}
