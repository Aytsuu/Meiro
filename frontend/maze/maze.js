
const style = document.createElement('style');
style.textContent = `
    * { margin: 0; padding: 0; }
    body, html { 
        width: 100%; 
        height: 100%; 
        overflow: hidden;
        background: black;
    }
    canvas {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
    }
`;
document.head.appendChild(style);

// Set up canvas
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Tile size for maze
const tileSize = 128;

// Resize canvas to fit the window
function resizeCanvas() {
    // Adjust canvas size based on the window size and tile size
    canvas.width = Math.ceil(window.innerWidth / 32) * 32 + 32;
    canvas.height = Math.ceil(window.innerHeight / 32) * 32 + 32;
    
    // Calculate the number of columns and rows
    const cols = Math.ceil(canvas.width / 32);
    const rows = Math.ceil(canvas.height / 32);
    
    return { cols, rows };
}

// Initialize maze grid
let { cols, rows } = resizeCanvas();
let maze = Array.from({ length: rows }, () => Array(cols).fill(1));

// Directions for maze generation (up, right, down, left)
const directions = [
    [0, -1],  // Up
    [1, 0],   // Right
    [0, 1],   // Down
    [-1, 0]   // Left
];

// Initialize maze to all walls
function initializeMaze() {
    maze = Array.from({ length: rows }, () => Array(cols).fill(1));
}

// Generate maze using recursive backtracking
function generateMaze(x, y) {
    maze[y][x] = 0;  // Mark current cell as part of the maze
    
    // Shuffle directions to ensure random path generation
    shuffle([...directions]).forEach(([dx, dy]) => {
        const nx = x + dx * 2;  // New x-coordinate
        const ny = y + dy * 2;  // New y-coordinate
        
        // If the new cell is within bounds and is a wall, generate a path
        if (isInBounds(nx, ny) && maze[ny][nx] === 1 &&
            nx > 1 && ny > 1 && nx < cols - 2 && ny < rows - 2) {
            maze[y + dy][x + dx] = 0;  // Remove wall between current and new cell
            generateMaze(nx, ny);  // Recursively generate the maze
        }
    });
}

// Find a random position for special areas with some constraints
function findRandomAreaPosition() {
    const minDistance = Math.min(cols, rows) / 3;  // Minimum distance between areas
    let attempts = 0;
    const maxAttempts = 1000;  // Maximum attempts to find a valid position
    
    while (attempts < maxAttempts) {
        const x = Math.floor(Math.random() * (cols - 6)) + 3;
        const y = Math.floor(Math.random() * (rows - 6)) + 3;
        
        // Check if the position is valid and sufficiently far from other areas
        if (isValidAreaPosition(x, y) && isFarFromOtherAreas(x, y, minDistance)) {
            return [x, y];
        }
        attempts++;
    }
    return null;  // Return null if no valid position is found after max attempts
}

// Check if the area is sufficiently far from other special areas
function isFarFromOtherAreas(x, y, minDistance) {
    for (let area of areas) {
        const dx = x - area[0];
        const dy = y - area[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) return false;  // If too close, return false
    }
    return true;
}

// Check if a position is valid for placing a special area
function isValidAreaPosition(x, y) {
    for (let dy = -2; dy <= 4; dy++) {
        for (let dx = -2; dx <= 4; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (!isInBounds(nx, ny)) return false;  // Position out of bounds
            if (maze[ny][nx] === 2) return false;  // Area already occupied
        }
    }
    return true;  // Position is valid
}

// Create a special area (a 3x3 block) and connect it to the maze
function createSpecialArea(centerX, centerY) {
    // Create a 3x3 open area
    for (let y = centerY - 1; y <= centerY + 1; y++) {
        for (let x = centerX - 1; x <= centerX + 1; x++) {
            maze[y][x] = 0;
        }
    }
    
    let connected = false;
    // Try to connect the special area to the maze by opening one neighboring wall
    shuffle(directions).forEach(([dx, dy]) => {
        if (!connected) {
            let x = centerX + dx * 2;
            let y = centerY + dy * 2;
            if (isInBounds(x, y) && maze[y][x] === 0) {
                maze[centerY + dy][centerX + dx] = 0;
                connected = true;  // Mark as connected
            }
        }
    });
}

// Check if coordinates are within maze bounds
function isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < cols && y < rows;
}

// Shuffle array randomly (used for randomizing directions)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Draw the maze on the canvas
function drawMaze() {
    // Fill entire canvas with black first
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze paths in white
    ctx.fillStyle = "#ECF8FF";
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 0) {
                ctx.fillRect(x * 32, y * 32, 32, 32);
            }
        }
    }
}

// Array to store positions of special areas
const areas = [];

// Generate a new maze
function generateNewMaze() {
    areas.length = 0;  // Clear previous areas
    initializeMaze();  // Initialize maze with walls
    
    // Start generation from the center of the maze for better distribution
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);
    generateMaze(startX, startY);
    
    // Create 3 special areas
    for (let i = 0; i < 3; i++) {
        const position = findRandomAreaPosition();
        if (position) {
            const [x, y] = position;
            createSpecialArea(x, y);
            areas.push([x, y]);  // Add the area to the list
        }
    }
    
    drawMaze();  // Draw the maze on the canvas
}

// Handle window resizing
window.addEventListener('resize', () => {
    ({ cols, rows } = resizeCanvas());  // Resize the canvas
    generateNewMaze();  // Regenerate the maze after resizing
});

// Initial maze generation
generateNewMaze();
