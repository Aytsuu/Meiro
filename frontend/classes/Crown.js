class Crown {     
    constructor({ size }) {         
        this.position = {             
            x: Math.floor(canvas.width / (tileSize * 2)) * tileSize, // Position at the center
            y: Math.floor((canvas.height - tileSize) / (tileSize * 2)) * tileSize
        };         
        
        this.size = size;

        objectsPosition.push(this.position)
    }      

    draw() {  
        
        // Drawing the object
        c.fillStyle = 'yellow';         
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);     
    } 
}
