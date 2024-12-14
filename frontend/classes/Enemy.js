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
                playerPos: player.position,
                crownPos: crown.position,
                position: this.position
            }

            // Handling data from callback
            const handleReturnedDate = (returnedData) => {

                this.position.x = returnedData.data.playerPos.x;
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
