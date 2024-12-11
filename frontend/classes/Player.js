class Player{
    constructor({size}){
        this.size = size
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.updateX = 0
        this.updateY = 0

    }

    movementUpdate(){

        this.updateX = Math.floor(this.velocity.x/64) * 64
        this.updateY = Math.floor(this.velocity.y/64) * 64
        
        console.log(Math.floor(this.velocity.x/64), Math.floor(this.velocity.y/64))

        if(this.position.x <= this.updateX || this.position.y <= this.updateY  || this.position.x >= this.updateX || this.position.y >= this.updateY){
            console.log('entered')
            this.position.x += (this.updateX - this.position.x)
            this.position.y += (this.updateY - this.position.y)

            console.log("Current Position", this.position.x, this.position.y)
        }

        
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}