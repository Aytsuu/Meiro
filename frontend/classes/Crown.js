class Crown {     
    constructor({ size }) {         
        this.position = {             
            x: 64 * 6, // Position at the bottom-right of the canvas
            y: 64 * 3
        };         
        this.size = size;
    }      

    draw() {         
        c.fillStyle = 'yellow';         
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);     
    } 
}
