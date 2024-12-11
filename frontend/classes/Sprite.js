class Sprite{
    constructor({position, size}){
        this.position = position
        this.size = size
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
}