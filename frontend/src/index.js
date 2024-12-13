
// Creating canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Initializing global variables
let setMove = false
const tileSize = 64
let path = []; // Stores the path points as an array of grid positions
let objectsPosition = []
let isDrawingPath = false; 
let isEnemyTurn = false;
let mouseX = 0;
let mouseY = 0;
let imageLoaded = false

// Initializing canvas and tile size
canvas.width = tileSize * 29;
canvas.height = tileSize * 16;

// Player object initialization
const player = new Player({
    imgSrc: '/frontend/assets/animations/player/Front animations/spr_player_front_idle.png', 
    frameRate: 12
})

// Enemy object initialization
const enemy = new Enemy({
    size: {
        width: tileSize,
        height: tileSize
    }
})

// Enemy object initialization
const crown = new Crown({
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
    player.draw();
    player.movementUpdate();

    // Draw the enemy and handle its turn
    enemy.draw();

    // Draw the crown object
    crown.draw();

    // Control and customize cursor for the game
    cursorControl();
}

function resizeCanvas() {

    if (!imageLoaded) return;
    // Calculate the canvas size based on the window size
    canvas.width = Math.floor(window.innerWidth / tileSize) * tileSize; // Full-width based on tile size
    canvas.height = Math.floor(window.innerHeight / tileSize) * tileSize; // Full-height based on tile size

    // Recalculate the grid size (number of tiles in rows and columns)
    player.size.width = tileSize;
    player.size.height = tileSize;
    enemy.size.width = tileSize;
    enemy.size.height = tileSize;
}

function cursorControl() {
    // Confine mouse within canvas boundaries
    if (mouseX < 0) mouseX = 0;
    if (mouseX > canvas.width) mouseX = canvas.width;
    if (mouseY < 0) mouseY = 0;
    if (mouseY > canvas.height) mouseY = canvas.height;

    // Draw a small circle at the mouse position
    // c.beginPath();
    c.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
    c.fillStyle = 'white';
    c.fill();
}

// Function to draw the map/grid
function drawMap() {
    // Loop through each row and column of tiles
    for (let i = 0; i < canvas.height / tileSize; i++) {
        for (let j = 0; j < canvas.width / tileSize; j++) {
            c.fillStyle = '#ECF8FF'
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
