class Sprite{
    constructor({position, size}){
        this.position = position
        this.size = size
    }

    draw(){
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }

}
