class Sprite{
    constructor({position, imgSrc, frameRate = 1}){
        this.position = position;
        this.img = new Image();
        this.img.onload = () => {
            imageLoaded = true;
            this.size = {
                width: this.img.width/frameRate,
                height: this.img.height
            }
        }
        this.img.src = imgSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.elapsedFrame = 0;
        this.frameBuffer = 4;

    }

    draw(){

        if(!imageLoaded) return
        const cropbox = {
            position: {
                x: this.size.width * this.currentFrame,
                y: 0
            },
            size: {
                width: this.size.width,
                height: this.size.height
            }
        }

        c.drawImage(this.img, cropbox.position.x, cropbox.position.y, cropbox.size.width, cropbox.size.height, this.position.x, this.position.y, this.size.width, this.size.height);
        this.updateFrame();
    }

    updateFrame(){
        this.elapsedFrame++;
        if(this.elapsedFrame % this.frameBuffer === 0){
            if(this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else this.currentFrame = 0;
        }
    }

}
