class Player{
    constructor({size}){

        // Initializing player attributes

        this.size = size // Fixed size according to tile size

        this.position = { // Initial player position
            x: 0,
            y: 0
        }

        // For player movement update
        this.velocity = {
            x: 0,
            y: 0
        }

        this.updateX = 0
        this.updateY = 0

    }

    movementUpdate(){

        // Calculating the position where mouse click occured by float to integer conversion and multiplying it by the tile size

        if(setMove) {
            this.updateX = Math.floor(this.velocity.x/64) * 64
            this.updateY = Math.floor(this.velocity.y/64) * 64

            // Performs the player position update
            if(this.position.x <= this.updateX || this.position.y <= this.updateY || this.position.y >= this.updateY){

                this.position.x += (this.updateX - this.position.x) // Updates the x position
                this.position.y += (this.updateY - this.position.y) // Updates the y position

            }
            else{
                setMove = false // Disabling setmove to prevent recurring updates when its not needed
            }

        }

    }

    // Rendering the player
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}