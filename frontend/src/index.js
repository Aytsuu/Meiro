// Creating canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Initializing canvas and tile size 
canvas.width = 64 * 25
canvas.height = 64 * 12
tileSize = 64

// Initializing global variables
let setMove = false
let currentX = 0;
let currentY = 0;

// Player object initialization
const player = new Player({
    size: {
        width: tileSize,
        height: tileSize
    }
})

// This function renders all objects and re-render them infinitely
function animate(){
    window.requestAnimationFrame(animate)

    // Rendering the map
    for (let i = 0; i < canvas.height / tileSize; i++){
        for (let j = 0; j < canvas.width / tileSize; j++){
            c.fillStyle = '#1e1e1e'
            c.strokeStyle = 'white'
            c.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
        }
    }

    // Rendering the player 
    player.draw()
    player.movementUpdate()

    // Updates player position
    player.velocity.x = 0
    player.velocity.y = 0

    if(setMove){
        player.velocity.x = currentX
        player.velocity.y = currentY
    }

}

animate() // Function calling
