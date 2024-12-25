class Essence extends Sprite{     
    constructor({ imgSrc, frameRate, imgSize, position, animations }) {
        super({imgSrc, frameRate, animations})

        this.imgSize = imgSize
        this.currentState = new PickEssence(this)

        this.position = {             
            x: position.x,
            y: position.y
        };         

        this.hitbox = {
            w: this.imgSize,
            h: this.imgSize
        }

        this.speed = 3;
    }    

    drawHitbox(){
        
        c.fillStyle = 'rgba(255,0,0,30%)';
        c.fillRect(this.position.x, this.position.y, this.hitbox.w, this.hitbox.h);
    }


    spriteAnimation(name){
        // Switch animation
        this.currentFrame = 0;
        const animation = this.animations[name];

        this.img = animation.img;
        this.frameRate = animation.frameRate;
        this.frameBuffer = animation.frameBuffer;

        // Recalculate size after changing the image
        if(this.img.complete) {
            this.size.width = this.img.width / this.frameRate;
            this.size.height = this.img.height;
        } else {
            this.img.onload = () => {
                this.size.width = this.img.width / this.frameRate;
                this.size.height = this.img.height;
            }
        }

    }
    
    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }

    update(){
        this.currentState.update();
    }
}

// FINITE STATE MACHINE (FSM)
class PickEssence extends State{
    
    update(){

        // Center x and y-axis  of the player's  position
        const playerCenterPositionX = player.position.x + player.hitbox.w / 2;
        const playerCenterPositionY = player.position.y + player.hitbox.h / 2; 
        
        // Check if object reached the target position
        if(Math.floor(this.entity.position.x / this.entity.position.x) == Math.floor(playerCenterPositionX / this.entity.position.x) && 
            Math.floor(this.entity.position.y / this.entity.position.y) == Math.floor(playerCenterPositionY / this.entity.position.y)) {
                
                essenceCollected = true;
                isParried = false;
        } 

        // Update object position
        if(this.entity.position.x < playerCenterPositionX){
            this.entity.position.x += this.entity.speed;
        }
        if(this.entity.position.x > playerCenterPositionX){
            this.entity.position.x -= this.entity.speed;
        }
        if(this.entity.position.y < playerCenterPositionY){
            this.entity.position.y += this.entity.speed;
        }
        if(this.entity.position.y > playerCenterPositionY){
            this.entity.position.y -= this.entity.speed;
        }
        
        
    }
}
