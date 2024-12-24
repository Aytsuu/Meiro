class Object extends Sprite{     
    constructor({ imgSrc, frameRate, imgSize, position, animations }) {
        super({imgSrc, frameRate, animations})

        this.imgSize = imgSize

        this.position = {             
            x: position.x,
            y: position.y
        };         

        this.speed = 6;
    }    
    
    setState(newState) {
        this.currentState.exit();  // Exit the current state
        this.currentState = newState;
        this.currentState.enter(); // Enter the new state
    }
}

// class PickObject extends State{
    
//     update(){

//         const playerPositon = player.position

//         if()



//     }
// }
