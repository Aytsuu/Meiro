class Sprite{
    constructor({position, imgSrc, frameRate = 1, imgSize, animations}){
        
        this.img = new Image(); // Creates new image in memory
        this.imgSize = imgSize
        this.img.onload = () => { // Waits till the image is loaded to the browser
            imageLoaded = true;

            // Takes the size of the image per frame
            this.size = {
                width: this.img.width/frameRate,
                height: this.imgSize
            }
        }
        this.position = position;
        this.img.src = imgSrc; // Image source
        this.frameRate = frameRate; // Number of frames in an image

        // Initializing attributes for animation
        this.currentFrame = 0;
        this.elapsedFrame = 0; // A factor to determine when current frame will be incremeneted
        this.frameBuffer = 4; // Animation speed, the greater the value, the slower it moves from one frame to another.

        this.animations = animations

        if(this.animations){
            for(let key in this.animations){
                const img = new Image()
                img.src = this.animations[key].imgSrc
                this.animations[key].img = img
            }
        }
    }

    draw(){

        // Checks If image has been loaded to the browser
        if(imageLoaded){

            // Crop position and size, to display only one frame on the screen
        
            const cropbox = {
                position: {
                    x: this.size.width * this.currentFrame, // Creates the illusion of motion by moving one frame to another
                    y: 0
                },
                size: {
                    width: this.size.width,
                    height: this.size.height
                }
            }
            

            // Drawing the image
            c.drawImage(this.img, cropbox.position.x, cropbox.position.y, cropbox.size.width, cropbox.size.height, this.position.x, this.position.y, this.size.width, this.size.height);
            this.updateFrame(); // Updates the frame 

        }
    }

    updateFrame(){
        this.elapsedFrame++;
        if(this.elapsedFrame % this.frameBuffer === 0){ // If true, moves the current frame to another
            if(this.currentFrame < this.frameRate - 1) this.currentFrame++; // Increment if current frame is less than to the number of frames in an image
            else this.currentFrame = 0; // Otherwise, reset current frame to the initial frame
        }
    }

}
