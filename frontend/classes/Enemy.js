class Enemy {
    constructor({ size }) {
        this.position = {
            x: canvas.width - tileSize, // Position at the bottom-right of the canvas
            y: canvas.height - tileSize
        };
        this.size = size;

        objectsPosition.push(this.position)
    }

    move() {
        
        // Generate random moves within the allowed number of tiles
        const randomX = (Math.floor(Math.random() * 3) - 1) * tileSize;
        const randomY = (Math.floor(Math.random() * 3) - 1) * tileSize;

        // Ensure the enemy stays within the canvas boundaries
        const newX = this.position.x + randomX;
        const newY = this.position.y + randomY;

        if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
            this.position.x = newX;
            this.position.y = newY;
        }
    }

    draw() {

        // Drawing the object
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
