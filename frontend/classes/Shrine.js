class Shrine extends Sprite{     
    constructor({ imgSrc, frameRate, imgSize, position, animations }) {
        super({imgSrc, frameRate, animations})

        this.imgSize = imgSize
        this.currentState = new ChangeAnimationState(this);

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
}

class ChangeAnimationState extends State{
    enter(){

        const shrineState = ['noEssence', 'oneEssence', 'twoEssence', 'completeEssence'];
        this.entity.spriteAnimation(shrineState[totalEssence]);
        if(totalEssence == 3){
            isGameEnd = true;
        }

    }
}

