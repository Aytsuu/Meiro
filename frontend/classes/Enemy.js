class Enemy extends Sprite{
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})
        
        // Initial position
        this.position = { 
            x: 0, 
            y: canvas.height - tileSize
        }; 

    }

    movementUpdate() {

        // Enemy's turn to move
        if(isEnemyTurn){

            // Initializing JSON to be sent to backend
            const data = {

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
                    crownPosition: crown.position
                },

                // TODO: program for direction, reward, gameOver, and score
                direction: direction,
                reward: reward,
                gameOver: isGameOver,
                score: score
            }

            // Handling data from callback
            const handleReturnedDate = (returnedData) => {
                
                // Returned data could be...
                // [1,0,0] - straight
                // [0,1,0] - right
                // [0,0,1] - left

                // TODO: Create the logic 



                isEnemyTurn = false;

            }

            // Sends data to python with Flask api
            sendData({data}, handleReturnedDate)
        }
    }

    // Highlight turns
    isTurn(){
        const borderWidth = 3;
        c.strokeStyle = 'red';
        c.lineWidth = borderWidth;
        c.strokeRect(this.position.x + borderWidth / 2,this.position.y + borderWidth / 2, tileSize - borderWidth, tileSize - borderWidth);
    }

    checkPassability() {

        const point_right = {x: this.position.x + tileSize, y: this.position.y}
        const point_left = {x: this.position.x - tileSize, u: this.position.y}
        const point_up = {x: this.position.x, y: this.position.y - tileSize}
        const point_down = {x: this.position.x, y: this.position.y + tileSize}
    
        passability = [
    
            // Straight
            direction == 1 && this.collisionDetection(point_right) ||
            direction == 2 && this.collisionDetection(point_left) ||
            direction == 3 && this.collisionDetection(point_up) ||
            direction == 4 && this.collisionDetection(point_down),
            
            // Right
            direction == 1 && this.collisionDetection(point_down) ||
            direction == 2 && this.collisionDetection(point_up) ||
            direction == 3 && this.collisionDetection(point_right) ||
            direction == 4 && this.collisionDetection(point_left),

            // Left
            direction == 1 && this.collisionDetection(point_up) ||
            direction == 2 && this.collisionDetection(point_down) ||
            direction == 3 && this.collisionDetection(point_left) ||
            direction == 4 && this.collisionDetection(point_right),

        ]
    
    }

    collisionDetection(position) {
        return obstacles.some(obstacle => position.x == obstacle.x && position.y == obstacle.y)
    }
}
