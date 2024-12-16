class Enemy extends Sprite{
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})
        
        // Initial position
        this.position = { 
            x: 0, 
            y: canvas.height - tileSize
        }; 

        objectsPosition.push(this.position); // Add as an object

    }

    movementUpdate() {

        // Enemy's turn to move
        if(isEnemyTurn){

            // Initializing JSON to be sent to backend
            const data = {
                environment: {
                    width: canvas.width,
                    height: canvas.height
                },
                state: {
                    position: this.position,
                    crownPosition: crown.position
                },

                // TODO: program for reward, gameOver, and score
                reward: 0,
                gameOver: isGameOver,
                score: 0
            }

            // Handling data from callback
            const handleReturnedDate = (returnedData) => {
                
                // Returned data could be...
                // [1,0,0,0] - up move 
                // [0,1,0,0] - right move
                // [0,0,1,0] - down move
                // [0,0,0,1] - left move

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
}
