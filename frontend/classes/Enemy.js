class Enemy {
    constructor({ size }) {
        this.position = {
            x: 64 * 10, // Initial enemy position (column 10, row 5)
            y: 64 * 5   
        }
        this.size = size
    }

    // color red tile for enemy
    draw() {
        c.fillStyle = 'red' 
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}
