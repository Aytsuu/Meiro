class Enemy extends Sprite{
    constructor({ aiId, imgSrc, frameRate, imgSize, position, healthpoint, hitbox, speed, parryFrame, audio, animations }) {
        super({imgSrc, frameRate, animations})

        this.imgSize = imgSize
        
        // Initial position
        this.position = { 
            x: position.x, 
            y: position.y
        }; 
        this.speed = speed
        this.velocity = {x: 0, y: 0}
        this.data = {}
        this.currentState = new EnemyIdleState(this);

        // Initialize Hitbox
        this.hitbox = {
            w: hitbox.x,
            h: hitbox.y
        }

        // Healthbar
        this.barSize = {
            w: 50,
            h: 5
        }

        this.currentHealthpoint = healthpoint;
        this.totalHealthpoint = healthpoint;

        // Training and action
        this.aiId = aiId
        this.action = [0,0,0,0];
        this.prevAction = [];
        this.phase = 1; // Training Phase
        this.isAttack = false;
        this.attackFlag = 0;

        // Frame where parry is applicable
        this.parryFrame = parryFrame
        this.isParried = false;

        this.essenceDropped = false;

        // Sound effects
        this.audio = audio

        // Wounding effect
        this.playerWoundInterval = 1;
        this.playerWoundBuffer = 5;
        this.woundInterval = 1;
        this.woundBuffer = 10;
    }

    drawHitbox(){

        const newEnemyPosX = this.position.x + (this.imgSize - this.hitbox.w) / 2
        const newEnemyPosY = this.position.y + (this.imgSize - this.hitbox.h) / 2
        
        c.fillStyle = 'rgba(255,0,0,30%)';
        c.fillRect(newEnemyPosX, newEnemyPosY, this.hitbox.w, this.hitbox.h);
    }

    drawHealthbar(){
        c.font = `8px Poppins`;
        c.fillStyle = '#FFFFFF'
        c.fillText(`${this.currentHealthpoint}/${this.totalHealthpoint}`, this.position.x + this.imgSize / 2 - 25 + this.barSize.w / 2, this.position.y + ((this.imgSize - this.hitbox.h) / 2) - this.barSize.h);
        
        c.strokeStyle = 'black'
        c.lineWidth = 2;
        c.fillStyle = 'red';
        c.fillRect(this.position.x + this.imgSize / 2 - 25, this.position.y + ((this.imgSize - this.hitbox.h) / 2), this.barSize.w, this.barSize.h);
        c.strokeRect(this.position.x + this.imgSize / 2 - 25, this.position.y + ((this.imgSize - this.hitbox.h) / 2), 50, this.barSize.h);
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

    getData(){

        // Initializing JSON to be sent to backend
        this.data = {

            phase: this.phase,

            // Tile Passability
            collision: {
                right: passability[0],
                left: passability[1],
                up: passability[2],
                down: passability[3]
            },

            // Game state
            state: {
                position: this.position,
                playerPosition: player.position,
                direction: direction
            },
            
            reward: reward,
            score: score,
            gameOver: done
        }

    }

    decision() {

        // Get data
        this.getData()

        // Sends data to python flask with web socket
        sendData(this.data, this.aiId);

    }

    train(){

        //Re-evaluate tile passability and collisions
        this.checkPassability();

        // Get data
        this.getData();

        // Send another data to flask
        sendResponse(this.data, this.aiId);

        this.phase = 1;

        // New training
        if(done){
            done = !done;
            score = 0
            direction = 0;
            lastPlayerDirection = 3
        }

    }

    slayPlayer(){

        if(isPlayerKilled){
            return;
        }
        
        const isPlayerInRange = this.playerInRange();

        if(isPlayerInRange){

            if(this.playerWoundInterval % this.playerWoundBuffer === 0){
                
                this.playerWoundInterval = 1;
                player.currentHealthpoint -= 2;
                player.barSize.w--;

            }
            
            if(player.currentHealthpoint <= 0){
                playerKilledAudio.play();
                isPlayerKilled = true;
                this.reset();
            }
            
            this.isAttack = true;
            if(this.attackFlag == 0) {
                this.setState(new EnemyAttackState(this));
                this.attackFlag = 1;
            }

            this.playerWoundInterval++;
        }
    }

    playerInRange(){

        // New position x and y axis with consideration to the hitbox
        const newEnemyPosX = this.position.x + (this.imgSize- this.hitbox.w) / 2
        const newEnemyPosY = this.position.y + (this.imgSize - this.hitbox.h) / 2
        const newPlayerPosX = player.position.x + (player.imgSize - player.hitbox.w) / 2
        const newPlayerPosY = player.position.y + (player.imgSize - player.hitbox.h) / 2

        // Attack at the direction of the player
        if(newPlayerPosX >= newEnemyPosX + (this.hitbox.w / 2) && newPlayerPosX <= newEnemyPosX + this.hitbox.w) direction = 0;
        if(newPlayerPosX + player.hitbox.w >= newEnemyPosX && newPlayerPosX + player.hitbox.w <= newEnemyPosX + (this.hitbox.w / 2)) direction = 1;
        if(newPlayerPosY + player.hitbox.h >= newEnemyPosY && newPlayerPosY + player.hitbox.h <= newEnemyPosY + (this.hitbox.h / 2)) direction = 2;
        if(newPlayerPosY >= newEnemyPosY + (this.hitbox.h / 2) && newPlayerPosY <= newEnemyPosY + this.hitbox.h) direction = 3;

        return(
            // If enemy position x is greater than player position x
            // Check if enemy hit box collides with player hitbox
            (newEnemyPosX + this.hitbox.w >= newPlayerPosX && newEnemyPosX + this.hitbox.w <= newPlayerPosX + player.hitbox.w &&
            (newEnemyPosY + this.hitbox.h >= newPlayerPosY && newEnemyPosY + this.hitbox.h <= newPlayerPosY + player.hitbox.h ||
            newEnemyPosY >=  newPlayerPosY && newEnemyPosY <= newPlayerPosY + player.hitbox.h))

            ||

            // If player position x is greater than enemy position x
            // Check if player hit box collides with enemy hitbox
            (newPlayerPosX + player.hitbox.w >= newEnemyPosX && newPlayerPosX + player.hitbox.w <= newEnemyPosX + this.hitbox.w &&
            (newPlayerPosY + player.hitbox.h >= newEnemyPosY && newPlayerPosY + player.hitbox.h <= newEnemyPosY + this.hitbox.h ||
            newPlayerPosY >= newEnemyPosY && newPlayerPosY <= newEnemyPosY + this.hitbox.h))
        )

    }

    reset(){
        
        // Reset and give reward
        done = true;
        reward = 10;
        player.currentHealthpoint = player.totalHealthpoint;
        player.barSize.w = 50;
        this.currentHealthpoint = this.totalHealthpoint;
        this.barSize.w = 50;
        
        totalDeath++;
        essenceCollected = false;

 
        if(steps >= 100) score = 300;
        if(steps >= 500) score = 250;
        if(steps >= 1000) score = 200;
        if(steps >= 2000) score = 150;
        if(steps >= 3000) score = 100;
        if(steps >= 7000) score = 50;
        if(steps >= 13000) score = 30;
        if(steps >= 17000) score = 20;
        if(steps >= 20000) score = 5;

        steps = 0; 
    }

    checkPassability() {

        passability = [];

        // Movement points 
        const point_right = {x: this.position.x - ((this.imgSize - this.hitbox.w) / 2) + this.speed, y: this.position.y};
        const point_left = {x: this.position.x + ((this.imgSize - this.hitbox.w) / 2) - this.speed, u: this.position.y};
        const point_up = {x: this.position.x, y: this.position.y + ((this.imgSize - this.hitbox.h) / 2) - this.speed};
        const point_down = {x: this.position.x, y: this.position.y - ((this.imgSize - this.hitbox.h) / 2) + this.speed};
    
        // right
        passability.push(point_right.x > canvas.width - (this.imgSize));
        
        // left
        passability.push(point_left.x < 0);

        // up
        passability.push(point_up.y < 5) ;    

        //down
        passability.push(point_down.y > canvas.height - (this.imgSize) - 30);

    }

    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }

    wounding(){

        if(this.currentHealthpoint > 0){
            if(this.woundInterval % this.woundBuffer === 0){
                this.currentHealthpoint -= 2;
                this.woundInterval = 1;
    
                if((this.totalHealthpoint - this.currentHealthpoint) % (this.totalHealthpoint / 50) == 0){
                    this.barSize.w--;
                }
            }
        }

        this.woundInterval++;

    }

    getStateFromAction(){

        if(totalEssence >= 2 && this.currentHealthpoint > 0){
            const random = Math.floor(Math.random() * 200);
            if(random >= 199) return new WarpState(this);
        }

        if (JSON.stringify(this.action) == JSON.stringify([1,0,0,0])) return new EnemyMoveRightState(this);
        if (JSON.stringify(this.action)  == JSON.stringify([0,1,0,0])) return new EnemyMoveLeftState(this);
        if (JSON.stringify(this.action)  == JSON.stringify([0,0,1,0])) return new EnemyMoveUpState(this);
        if (JSON.stringify(this.action)  == JSON.stringify([0,0,0,1])) return new EnemyMoveDownState(this);
        return new EnemyIdleState()
    }

    movementUpdate(){
        this.currentState.update();
        steps++
    }
}


// FINITE STATE MACHINE (FSM) IMPLEMENTATION

class WarpState extends State{
    enter(){
        this.entity.spriteAnimation('warp');
        this.entity.isAttack = true;
        this.entity.attackFlag = 1;
        this.entity.position.x = player.position.x - player.hitbox.w
        this.entity.position.y = player.position.y;
        this.entity.audio.warp.play();

        if(this.entity.currentHealthpoint - 20 >= 0) {
            this.entity.currentHealthpoint -= 20;
        }
        else{
            this.entity.currentHealthpoint = 0;
            this.entity.barSize.w = 0;
        }
    }
    update(){

        if(this.entity.currentFrame >= this.entity.frameRate - 1){

            this.entity.isAttack = false;
            this.entity.attackFlag = 0;
            this.entity.setState(this.entity.getStateFromAction(this.entity.action));
        }
    }
}

class EnemyFazedState extends State{
    enter(){
        
        this.entity.spriteAnimation('fazed')
        this.entity.audio.fazed.play();

    }
    
    update(){

        if( this.entity.currentFrame >= this.entity.frameRate - 1){

            this.entity.isParried = false;
            this.entity.isAttack = false;
            this.entity.attackFlag = 0     
            this.entity.setState(this.entity.getStateFromAction(this.entity.action));
            shadowEssence.setState(new PickEssence(shadowEssence))
        }
    }
}

class EnemyAttackState extends State{
    enter(){

        const attack = ['attackRight', 'attackLeft', 'attackUp', 'attackDown']
        this.entity.spriteAnimation(attack[direction]);

    }
    update(){

        this.entity.audio.attack.play()

        this.entity.isParried && console.log('Parried Successfully')

        if(this.entity.isParried){
            if(this.entity.currentHealthpoint - 100 >= 0){
                this.entity.currentHealthpoint -= 100;
                this.entity.barSize.w -= 100 / (this.entity.totalHealthpoint / this.entity.barSize.w);
            }
            else{
                this.entity.currentHealthpoint = 0;
                this.entity.barSize.w = 0;
            }
            this.entity.setState(new EnemyFazedState(this.entity))
        }

        // Check if the attack animation is completed
        if (this.entity.currentFrame >= this.entity.frameRate - 1 && (!this.entity.isParried)) {

            const isPlayerInRange = this.entity.playerInRange() 
            if(isPlayerInRange) {
                playerKilledAudio.play();
                isPlayerKilled = true;
                this.entity.reset();
            }

            this.entity.isAttack = false;
            this.entity.attackFlag = 0;
            this.entity.setState(this.entity.getStateFromAction(this.entity.action));
        }
    }

}

class EnemyIdleState extends State {
    enter() {

        const idle = ['moveRight', 'moveLeft', 'moveUp', 'moveDown']
        this.entity.spriteAnimation(idle[direction])
        
    }

    update() {
        // No movement in idle state
    }
}

// Moving Left State
class EnemyMoveRightState extends State {
    enter() {

        direction = 0
        this.entity.spriteAnimation('moveRight');
        this.entity.velocity = { x: -this.entity.speed, y: 0 };
    }

    update() {
        
        if(this.entity.position.x - ((this.entity.imgSize - this.entity.hitbox.w) / 2) + this.entity.speed > canvas.width - (this.entity.imgSize)) {

            this.entity.wounding();
            reward = -10;
        }
        else this.entity.position.x += this.entity.speed;
    }
}

// Moving Right State
class EnemyMoveLeftState extends State {
    enter() {

        direction = 1
        this.entity.spriteAnimation('moveLeft');
        this.entity.velocity = { x: this.entity.speed, y: 0 };
    }

    update() {

        if(this.entity.position.x + ((this.entity.imgSize - this.entity.hitbox.w) / 2) - this.entity.speed < 0){
            
            this.entity.wounding();
            reward = -10;
        }
        else {
            this.entity.position.x -= this.entity.speed;
        }
    }
}

// Moving Up State
class EnemyMoveUpState extends State {
    enter() {

        direction = 2
        this.entity.spriteAnimation('moveUp');
        this.entity.velocity = { x: 0, y: -this.entity.speed };
    }

    update() {
        
        if(this.entity.position.y + ((this.entity.imgSize - this.entity.hitbox.h) / 2) - this.entity.speed < -20){
            
            this.entity.wounding();
            reward = -10;
        }
        else {
            this.entity.position.y -= this.entity.speed;
        }
    }
}

// Moving Down State
class EnemyMoveDownState extends State {
    enter() {
        
        direction = 3
        this.entity.spriteAnimation('moveDown');
        this.entity.velocity = { x: 0, y: this.entity.speed };
    }

    update() {

        if(this.entity.position.y - ((this.entity.imgSize - this.entity.hitbox.h) / 2) + this.entity.speed > canvas.height - (this.entity.imgSize) - 20){
            
            this.entity.wounding();
            reward = -10;
        }
        else{
            this.entity.position.y += this.entity.speed;

        }
    }
}

