
// Creating canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Initializing global variables
let setMove = false
const tileSize = 64
let path = []; // Stores the path points as an array of grid positions
let isDrawingPath = false; 

// Initializing canvas and tile size
canvas.width = tileSize * 29
canvas.height = tileSize * 16

// Player object initialization
const player = new Player({
    size: {
        width: tileSize,
        height: tileSize
    }
})

// Enemy object initialization
const enemy = new Enemy({
    size: {
        width: tileSize,
        height: tileSize
    }
})

// This function renders all objects infinitely
function animate() {
    window.requestAnimationFrame(animate);

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the map and the path
    drawMap();
    drawPath();

    // Update and draw the player
    player.movementUpdate();
    player.draw();

    // Draw the enemy (remove the update method)
    enemy.draw();
}

function resizeCanvas() {
    // Calculate the canvas size based on the window size
    canvas.width = Math.floor(window.innerWidth / tileSize) * tileSize; // Full-width based on tile size
    canvas.height = Math.floor(window.innerHeight / tileSize) * tileSize; // Full-height based on tile size

    // Recalculate the grid size (number of tiles in rows and columns)
    player.size.width = tileSize;
    player.size.height = tileSize;
    enemy.size.width = tileSize;
    enemy.size.height = tileSize;
}

// Function to draw the map/grid
function drawMap() {
    // Loop through each row and column of tiles
    for (let i = 0; i < canvas.height / tileSize; i++) {
        for (let j = 0; j < canvas.width / tileSize; j++) {
            c.fillStyle = '#1e1e1e'
            // c.strokeStyle = 'white'
            // c.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
        }
    }
}

// Function to draw the path on the grid
function drawPath() {
    // Set the stroke color for the path
    c.fillStyle = '#93CBDF';
    c.strokeStyle = '#93CBDF';
    c.beginPath();

    // Loop through each point in the path

    for (let i = 0; i < path.length; i++) {
        const point = path[i];
        
        // c.strokeRect((point.x/tileSize) * tileSize, (point.y/tileSize) * tileSize, tileSize, tileSize)
        c.fillRect((point.x/tileSize) * tileSize, (point.y/tileSize) * tileSize, tileSize, tileSize)



    }
    // Render the path on the canvas
    c.stroke();
}

// Initial canvas size setup
resizeCanvas();

animate() // Function calling
