class Interaction extends Sprite{
    constructor({ imgSrc, frameRate, imgSize, position, animations }){
        super({imgSrc, frameRate, animations});

            this.imgSize = imgSize;
            this.position = {
                x: position.x,
                y: position.y
            }
            this.currentState = new NoActionState(this);
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

    canInteract(object){

        const objectPosX = object.position.x
        const objectPosY = object.position.y
        const playerPosX = player.position.x + (player.imgSize - player.hitbox.w) / 2
        const playerPosY = player.position.y + (player.imgSize - player.hitbox.h) / 2

        // Calculate bounding box for the object
        let objectBoundingBox = {
            x: Math.min(objectPosX, objectPosX + this.imgSize) - object.imgSize / 2,
            y: Math.min(objectPosY, objectPosY + this.imgSize) - object.imgSize / 2,
            width: Math.abs(objectPosX + this.imgSize - objectPosX) + object.imgSize,
            height: Math.abs(objectPosY + this.imgSize - objectPosY) + object.imgSize
        };

        // Calculate bounding box for the player
        let playerBoundingBox = {
            x: Math.min(playerPosX, playerPosX + player.hitbox.w),
            y: Math.min(playerPosY, playerPosY + player.hitbox.h),
            width: Math.abs(playerPosX + player.hitbox.w - playerPosX) + player.hitbox.w,
            height: Math.abs(playerPosY + player.hitbox.h - playerPosY) + player.hitbox.h
        };

        // Check if both bounding boxes intersect
        return (
            playerBoundingBox.x <= objectBoundingBox.x + objectBoundingBox.width &&
            playerBoundingBox.x + playerBoundingBox.width >= objectBoundingBox.x &&
            playerBoundingBox.y <= objectBoundingBox.y + objectBoundingBox.height &&
            playerBoundingBox.y + playerBoundingBox.height >= objectBoundingBox.y
        );
    }

    setState(newState){
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    update(){
        this.currentState.handleInput();
        this.currentState.update();
    }
}

// FINITE STATE MACHINE (FSM)
class NoActionState extends State {

    enter() {
        this.entity.spriteAnimation('noAction');
    }

    handleInput() {
        if(keys.e.pressed) this.entity.setState(new InteractingShrineState(this.entity))
    }

    update() {
        // No action
    }

}

class InteractingShrineState extends State{ 

    enter() {

        this.entity.spriteAnimation('interacting');

    }

    handleInput() {
        if(!keys.e.pressed) this.entity.setState(new NoActionState(this.entity))
    }

    update() {

            if(this.entity.currentFrame >= this.entity.frameRate - 1){
                if(essenceCollected){
                    essenceCollected = false;
                    totalEssence ++;
                    shrine.setState(new ChangeAnimationState(shrine))
                }
                keys.e.pressed = false;
            }
    }
}