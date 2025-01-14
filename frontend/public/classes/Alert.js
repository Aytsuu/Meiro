class Alert extends Sprite{
    constructor({imgSrc, frameRate}){
        super({imgSrc, frameRate});

        // Initial position
        this.position = {
            x: 0,
            y: 0
        };
    }
}