
// Creating canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Initializing canvas and tile size
canvas.width = 64 * 29
canvas.height = 64 * 16
tileSize = 64

// Initializing global variables
let setMove = false

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

// This function renders all objects and re-render them infinitely
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

let path = []; // Stores the path points as an array of grid positions
let isDrawingPath = false; // Flag to track if the user is drawing a path

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


animate() // Function calling
