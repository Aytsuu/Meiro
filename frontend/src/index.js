
// Creating canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Initializing canvas and tile size
canvas.width = 64 * 25
canvas.height = 64 * 12
tileSize = 64

// Initializing global variables
let isDragging = false
let setMove = false
let offsetX = 0
let offsetY = 0
let startX = 0
let startY = 0



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
            c.strokeStyle = 'white'
            c.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
        }
    }
}


// Function to draw the path on the grid
function drawPath() {
    // Set the stroke color for the path
    c.strokeStyle = 'cyan';
    c.lineWidth = 2;
    c.beginPath();

    // Loop through each point in the path
    for (let i = 0; i < path.length; i++) {
        const point = path[i];
        // Move to the first point, adjusting the position by half of tileSize to center the path
        if (i == 0) {
            c.moveTo(point.x + tileSize / 2, point.y + tileSize / 2);
        } else {
            // Draw a line to the tiles
            c.lineTo(point.x + tileSize / 2, point.y + tileSize / 2);
        }
    }
    // Render the path on the canvas
    c.stroke();
}


animate() // Function calling
