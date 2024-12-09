const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 64 * 25
canvas.height = 64 * 12

tileSize = 64

for (let i = 0; i < canvas.height / tileSize; i++){
    for (let j = 0; j < canvas.width / tileSize; j++){
        c.fillStyle = '#1e1e1e'
        c.strokeStyle = 'white'
        c.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
        c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
    }
}

c.fillStyle = 'red'
c.fillRect(0, 0, tileSize, tileSize)

