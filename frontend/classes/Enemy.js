class Enemy extends Sprite{
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})
        
        // Initial position
        this.position = { 
            x: 0, 
            y: canvas.height - tileSize
        }; 

    }

    decision() {

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
                    crownPosition: crown.position,
                    direction: direction
                },

            }

            // Handling data from callback
            const handleReturnedDate = (returnedData) => {

                // Returned data could be...
                // [1,0,0] - straight
                // [0,1,0] - right
                // [0,0,1] - left

                // TODO: Create the logic 

                const action = JSON.stringify(returnedData);
                let new_dir = 0;

                if(action == JSON.stringify([1,0,0])){
                    new_dir = direction
                }
                else if(action == JSON.stringify([0,1,0])){
                    new_dir = (direction + 1) % 4 
                }
                else{
                    new_dir = (direction - 1) % 4
                }

                this.movementUpdate(new_dir)

            }

            // Sends data to python flask with web socket
            sendData({data}, handleReturnedDate);
        }

    }

    movementUpdate(new_dir) {

        const dir = ['right', 'left', 'up', 'down']

        
        console.log(new_dir,dir[new_dir])

        if(new_dir == 0){
            if(this.position.x + tileSize < canvas.width - tileSize) this.position.x += tileSize
        }
        else if(new_dir == 1){
            if(this.position.x - tileSize >= 0) this.position.x -= tileSize
        }
        else if(new_dir == 2){
            if(this.position.y - tileSize >= 0) this.position.y -= tileSize
        }
        else{
            if(this.position.y + tileSize < canvas.height - tileSize) this.position.y += tileSize
        }

        isEnemyTurn = false;
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
        return obstacles.some(obstacle => position.x == obstacle.x && position.y == obstacle.y) || 
                position.x < 0 ||
                position.x > canvas.width - tileSize ||
                position.y < 0 ||
                position.y > canvas.height - tileSize
    }
}
