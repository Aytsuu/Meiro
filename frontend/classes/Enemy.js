class Enemy {
    constructor({ size }) {
        this.position = {
            x: 64 * 10, // Initial enemy position (column 10, row 5)
            y: 64 * 5   
        }
        this.size = size
    }

    update(playerPosition) {
        // Simple movement logic: Follow the player's last position.
        if (playerPosition.x > this.position.x) {
            this.position.x += 5 // Move one tile to the right
        } else if (playerPosition.x < this.position.x) {
            this.position.x -= 5 // Move one tile to the left
        }

        if (playerPosition.y > this.position.y) {
            this.position.y += 5 // Move one tile down
        } else if (playerPosition.y < this.position.y) {
            this.position.y -= 5 // Move one tile up
        }
    }


    // color red tile for enemy
    draw() {
        c.fillStyle = 'red' 
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}



    