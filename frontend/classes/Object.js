class Object extends Sprite{     
    constructor({ imgSrc, frameRate, imgSize, position, hitbox, animations }) {
        super({imgSrc, frameRate, animations})

        this.imgSize = imgSize
        this.currentState = new PickObject(this)

        this.position = {             
            x: position.x,
            y: position.y
        };         

        this.hitbox = {
            w: this.imgSize - (this.imgSize - hitbox.x),
            y: this.imgSize - (this.imgSize - hitbox.y)
        }

        this.speed = 2;
    }    
    
    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }

    pickObject(){
        this.currentState.update();
    }
}

class PickObject extends State{
    
    update(){

        // Center x and y-axis  of the player's position
        const playerCenterPositionX = player.position.x + player.hitbox.w / 2;
        const playerCenterPositionY = player.position.y + player.hitbox.h / 2; 
        
        // Check if object reached the target position
        if(Math.floor(this.entity.position.x / this.entity.position.x) == Math.floor(playerCenterPositionX / this.entity.position.x) && 
            Math.floor(this.entity.position.y / this.entity.position.y) == Math.floor(playerCenterPositionY / this.entity.position.y)) {
            
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
