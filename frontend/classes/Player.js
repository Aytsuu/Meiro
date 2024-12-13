
// class Player {
//     constructor({size}) {
//         // Initializing player attributes
//         this.size = size // Fixed size according to tile size
//         this.position = { // Initial player position
//             x: 0,
//             y: 0
//         }
//         // For player movement update
//         this.velocity = {
//             x: 0,
//             y: 0
//         }
//         this.targetPosition = { 
//             x: 0, 
//             y: 0 
//         }
//     }

//     movementUpdate() {
//         if (setMove) {
//             // Calculate the target grid position
//             this.targetPosition.x = Math.floor(currentX / tileSize) * tileSize;
//             this.targetPosition.y = Math.floor(currentY / tileSize) * tileSize;

//             // Adjust for smoother/faster movement
//             const lerpSpeed = 0.1; //speed of the tile between start and end
//             this.position.x += (this.targetPosition.x - this.position.x) * lerpSpeed;
//             this.position.y += (this.targetPosition.y - this.position.y) * lerpSpeed;
//         }
//     }
    
//     // Rendering the player
//     draw() {
//         c.fillStyle = 'blue'
//         c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
//     }
// }

class Player {
    constructor({ size }) {
        this.size = size;
        this.position = { 
            x: 0, 
            y: 0 
        }; // Initial position
        this.currentTargetIndex = 0; // Index of the current target in the path
    }

    movementUpdate() {
        if (setMove && path.length > 0) {
            const target = path[this.currentTargetIndex];
            const lerpSpeed = 0.2; // Speed for smooth movement
    
            // Move toward the target point
            this.position.x += (target.x - this.position.x) * lerpSpeed;
            this.position.y += (target.y - this.position.y) * lerpSpeed;
    
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
                }
            }
        }
    }

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}
