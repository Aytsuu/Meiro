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
        if(isEnemyTurn){

            const data = {
                playerPos: player.position,
                crownPos: crown.position,
                position: this.position
            }

            sendData({data}, (returnedData) => {
                this.position.x = returnedData.data.playerPos.x;
                isEnemyTurn = false;
            })
        }
    }

    isTurn(){
        const borderWidth = 3;
        c.strokeStyle = 'red';
        c.lineWidth = borderWidth;
        c.strokeRect(this.position.x + borderWidth / 2,this.position.y + borderWidth / 2, tileSize - borderWidth, tileSize - borderWidth);
    }
}
