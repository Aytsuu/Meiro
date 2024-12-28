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

    drawBackgroundOutro(){

        c.fillStyle = 'rgba(0,0,0,90%)';
        c.fillRect(0, 0, canvas.width,  canvas.height);

    }

    focus(){ // Shadow casting

        let lightX = this.position.x + (this.imgSize / 2);
        let lightY = this.position.y + (this.imgSize / 2);

        // Create radial gradient for light
        const gradient = c.createRadialGradient(
            lightX, lightY, 0,
            lightX, lightY, 150
        );

        gradient.addColorStop(0, 'rgba(255, 8, 127, 1)');
        gradient.addColorStop(1, 'rgba(157, 0, 255, 0.2)');   
        
        // Draw light
        c.save();
        c.globalCompositeOperation = 'lighter';
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(lightX, lightY, 100, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }



    spriteAnimation(name){
        // Switch animation
        this.currentFrame = 0;
        const animation = this.animations[name];

        this.img = animation.img;
        this.frameRate = animation.frameRate;
        this.frameBuffer = animation.frameBuffer;
        this.imgSize = animation.imgSize

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

class ChangeAnimationState extends State{
    enter(){

        const shrineState = ['noEssence', 'oneEssence', 'twoEssence', 'completeEssence'];
        this.entity.spriteAnimation(shrineState[totalEssence]);
        if(totalEssence == 3){
            isGamePaused = true;
            isGameOver = true;
            shrine.setState(new EndingState(shrine));
        }
    }
}

class EndingState extends State{

    enter(){
        
        console.log('Entering EndingState');
        this.entity.spriteAnimation('completeEssence')

    }

    update(){

        if(this.entity.position.y > canvas.height / 4){
            this.entity.position.y -= 2;
        }else{
            scoring.draw();
        }
    }
}

