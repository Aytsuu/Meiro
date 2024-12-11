const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 25
canvas.height = 64 * 12
tileSize = 64

let setMove = false
let currentX = 0;
let currentY = 0;
// let startX;
// let startY;

let velocity = 0

const player = new Player({
    size: {
        width: tileSize,
        height: tileSize
    }
})


function animate(){
    window.requestAnimationFrame(animate)
    for (let i = 0; i < canvas.height / tileSize; i++){
        for (let j = 0; j < canvas.width / tileSize; j++){
            c.fillStyle = '#1e1e1e'
            c.strokeStyle = 'white'
            c.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
        }
    }

    player.draw()
    player.movementUpdate()

    player.velocity.x = 0
    player.velocity.y = 0


    if(setMove){
        player.velocity.x = currentX
        player.velocity.y = currentY
    }

}

animate()
