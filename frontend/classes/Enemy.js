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
                right: passability[0],
                left: passability[1],
                up: passability[2],
                down: passability[3]
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
                playerPostion: player.position,
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
                // [1,0,0,0] - right
                // [0,1,0,0] - left
                // [0,0,1,0] - up
                // [0,0,0,1] - down

                // [Right, DOWN, LEFT, UP]
                const action = JSON.stringify(returnedData.action);
                let new_dir = 0;
                phase = returnedData.phase

                if(action == JSON.stringify([1,0,0,0])){ // If right
                    new_dir = 0
                }
                else if(action == JSON.stringify([0,1,0,0])){ // If left
                    new_dir = 1
                }
                else if(action == JSON.stringify([0,0,1,0])){ // If up
                    new_dir = 2
                }
                else{ // If down
                    new_dir = 3
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

        // Move right left up down
        if(new_dir == 0){
            if(this.position.x + tileSize > canvas.width - tileSize) reward = -10;
            else this.position.x += tileSize;
        }
        else if(new_dir == 1){
            if(this.position.x - tileSize < 0) reward = -10;
            else {
                this.position.x -= tileSize;
                reward = 1
            }
        }
        else if(new_dir == 2){
            if(this.position.y - tileSize < 0) reward = -10;
            else {
                this.position.y -= tileSize;
                reward = 1
            }
        }
        else{
            if(this.position.y + tileSize > canvas.height - tileSize) reward = -10;
            else{
                this.position.y += tileSize;
                reward = 1
            }
        }

        // Exceeds the tile boundary
        // this.isOutbound();

        this.isKilled();

        // Takes the crown
        this.isTheKing();

        // 2nd training phase
        this.moveTrainingPhase();

    }

    moveTrainingPhase(){

        console.log(this.position.x, this.position.y)

        isEnemyTurn = false; // Change turn

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

    // Highlight turns
    isTurn(){

        const borderWidth = 3;
        c.strokeStyle = 'red';
        c.lineWidth = borderWidth;
        c.strokeRect(this.position.x + borderWidth / 2,this.position.y + borderWidth / 2, tileSize - borderWidth, tileSize - borderWidth);
    
    }

    isTheKing(){

        if(this.position.x == crown.position.x && this.position.y == crown.position.y) {
            score++;
            reward = 5;
            console.log(score)
        }

    }

    isKilled(){

        if(this.position.x == player.position.x && this.position.y == player.position.y) {
            isGameOver = true;
            reward = -10;
        }
    }

    // isOutbound(){

    //     if(this.position.x < 0 || this.position.x > canvas.width - tileSize ||
    //         this.position.y < 0 || this.position.y > canvas.height - tileSize
    //     ){
    //         reward = -10
    //     }
        
    // }

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
