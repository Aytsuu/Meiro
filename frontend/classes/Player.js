// class Player {
//     constructor({ size }) {
//         this.size = size;
        
//         // Initial position
//         this.position = { 
//             x: 0, 
//             y: 0 
//         }; 

//         this.currentTargetIndex = 0; // Index of the current target in the path

//     }


//     movementUpdate() {

//         if (setMove && path.length > this.currentTargetIndex) {

//             const target = path[this.currentTargetIndex];
//             const lerpSpeed = 0.2; // Speed for smooth movement

//             // Target point
//             const targetPointX = (target.x - this.position.x)
//             const targePointY = (target.y - this.position.y)


//             // Object collision detection

//             // this.position.x + targetPointX == enemy.position.x && this.position.y + targePointY == enemy.position.y ||
//             //     this.position.x + targetPointX == crown.position.x && this.position.y + targePointY == crown.position.y
            
//             if (objectsPosition.some(object => this.position.x + targetPointX === object.x && this.position.y + targePointY === object.y)){

//                 console.log('object detected')
//                 setMove = false;
//                 this.currentTargetIndex = 0;
//                 path = []; // Clear the path

//             }else{

//                 // Move toward the target point
//                 this.position.x += targetPointX * lerpSpeed;
//                 this.position.y += targePointY * lerpSpeed;
        
//                 // Check if the player reached the target point
//                 if (
//                     Math.abs(this.position.x - target.x) < 1 &&
//                     Math.abs(this.position.y - target.y) < 1
//                 ) {

//                     this.position.x = target.x;
//                     this.position.y = target.y;
        
//                     // Move to the next target point
//                     this.currentTargetIndex++;
        
//                     // If the end of the path is reached, stop moving and clear the path
//                     if (this.currentTargetIndex >= path.length) {
//                         setMove = false;
//                         this.currentTargetIndex = 0;
//                         path = []; // Clear the path
//                     }
//                 }
//             }

//         }
//     }

//     draw() {

//         // Drawing the object
//         c.fillStyle = 'green';
//         c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

//     }
// }


class Player extends Sprite{
    constructor({ imgSrc, frameRate }) {
        super({imgSrc, frameRate})
        
        // Initial position
        this.position = { 
            x: 0, 
            y: 0 
        }; 

        this.currentTargetIndex = 0; // Index of the current target in the path

    }


    movementUpdate() {

        if (setMove && !isEnemyTurn && path.length > this.currentTargetIndex) {

            const target = path[this.currentTargetIndex];
            const lerpSpeed = 0.2; // Speed for smooth movement

            // Target point
            const targetPointX = (target.x - this.position.x)
            const targePointY = (target.y - this.position.y)


            // Object collision detection
            
            if (objectsPosition.some(object => this.position.x + targetPointX === object.x && this.position.y + targePointY === object.y)){

                console.log('object detected')
                setMove = false;
                this.currentTargetIndex = 0;
                path = []; // Clear the path
                isEnemyTurn = true

            }else{

                // Move toward the target point
                this.position.x += targetPointX * lerpSpeed;
                this.position.y += targePointY * lerpSpeed;
        
                // Check if the player reached the target point
                if (
                    Math.abs(this.position.x - target.x) < 1 &&
                    Math.abs(this.position.y - target.y) < 1
                ) {

                    this.position.x = target.x;
                    this.position.y = target.y;
        
                    // Move to the next target point
                    this.currentTargetIndex++;
        
                    // If the end of the path is reached, stop moving and clear the path
                    if (this.currentTargetIndex >= path.length) {
                        setMove = false;
                        this.currentTargetIndex = 0;
                        path = []; // Clear the path
                        isEnemyTurn = true
                    }
                }
            }

        }
    }

    isTurn(){
        
        const borderWidth = 3;
        c.strokeStyle = 'green';
        c.lineWidth = borderWidth;
        c.strokeRect(this.position.x + borderWidth / 2,this.position.y + borderWidth / 2, tileSize - borderWidth, tileSize - borderWidth);
    }
}
