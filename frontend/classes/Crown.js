class Crown extends Sprite{     
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})

        this.position = {             
            x: Math.floor(canvas.width / (tileSize * 2)) * tileSize, // Position at the center
            y: Math.floor((canvas.height - tileSize) / (tileSize * 2)) * tileSize
        };         
        
    }      
}
