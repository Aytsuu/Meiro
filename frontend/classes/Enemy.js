class Enemy {
    constructor({ size }) {
        this.position = {
            x: 64 * 10, // Initial enemy position (column 10, row 5)
            y: 64 * 5   
        }
        this.size = size
    }

    update(playerPosition) {
        // // Simple movement logic: Follow the player's last position.
        // if (this.position.x < playerPosition.x - this.size.width) {
        //     this.position.x += 5 // Move one tile to the right
        // } else if (playerPosition.x - this.size.width < this.position.x) {
        //     this.position.x -= 5 // Move one tile to the left
        // }

        // if (this.position.y < playerPosition.y - this.size.height) {
        //     this.position.y += 5 // Move one tile down
        // } else if (playerPosition.y - this.size.height < this.position.y) {
        //     this.position.y -= 5 // Move one tile up
        // }

        // return
        
    }


    // color red tile for enemy
    draw() {
        c.fillStyle = 'red' 
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}



    