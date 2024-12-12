class Enemy {     
    constructor({ size }) {         
        this.position = {             
            x: canvas.width - tileSize, // Position at the bottom-right of the canvas
            y: canvas.height - tileSize
        };         
        this.size = size;
    }      

    draw() {         
        c.fillStyle = 'red';         
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);     
    } 
}