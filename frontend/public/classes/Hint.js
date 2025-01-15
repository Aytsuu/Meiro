class Hint extends Sprite{
    constructor({imgSrc, frameRate}){
        super({imgSrc, frameRate});
        this.position = {
            x: canvas.width / 2 - (516 / 2),
            y: 700
        }
    }
}