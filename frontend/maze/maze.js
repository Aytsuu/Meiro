

// Set up canvas
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Tile size for maze
const tileSize = 32;
const pathDensity = 0.35; // Controls how many walls are removed to create additional paths

// Resize canvas to fit the window
function resizeCanvas() {
    canvas.width = Math.ceil(window.innerWidth / 32) * 32 + 32;
    canvas.height = Math.ceil(window.innerHeight / 32) * 32 + 32;
    
    const cols = Math.ceil(canvas.width / 32);
    const rows = Math.ceil(canvas.height / 32);
    
    return { cols, rows };
}

// Initialize maze grid
let { cols, rows } = resizeCanvas();
let maze = Array.from({ length: rows }, () => Array(cols).fill(1));

// Directions for maze generation
const directions = [
    [0, -1],  // Up
    [1, 0],   // Right
    [0, 1],   // Down
    [-1, 0]   // Left
];

// Initialize maze
function initializeMaze() {
    maze = Array.from({ length: rows }, () => Array(cols).fill(1));
}

// Generate primary maze path using recursive backtracking
function generateMaze(x, y) {
    maze[y][x] = 0;
    
    // Use a modified shuffle that favors horizontal movement slightly
    const shuffledDirs = shuffleWithBias([...directions]);
    
    shuffledDirs.forEach(([dx, dy]) => {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        
        if (isInBounds(nx, ny) && maze[ny][nx] === 1 &&
            nx > 1 && ny > 1 && nx < cols - 2 && ny < rows - 2) {
            maze[y + dy][x + dx] = 0;
            generateMaze(nx, ny);
        }
    });
}

// Shuffle with slight bias towards horizontal movement
function shuffleWithBias(array) {
    // Duplicate horizontal directions to increase their probability
    const biasedArray = [...array];
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i][0] !== 0) { // If it's a horizontal direction
            biasedArray.push(array[i]);
        }
    }
    return shuffle(biasedArray);
}

// Create additional paths through the maze
function createAdditionalPaths() {
    const totalCells = (rows - 2) * (cols - 2);
    const pathsToAdd = Math.floor(totalCells * pathDensity);
    
    for (let i = 0; i < pathsToAdd; i++) {
        const x = 2 + Math.floor(Math.random() * (cols - 4));
        const y = 2 + Math.floor(Math.random() * (rows - 4));
        
        if (maze[y][x] === 1) {
            // Check if creating a path here would connect two existing paths
            let adjacentPaths = 0;
            directions.forEach(([dx, dy]) => {
                if (isInBounds(x + dx, y + dy) && maze[y + dy][x + dx] === 0) {
                    adjacentPaths++;
                }
            });
            
            // Only create new path if it connects existing paths
            if (adjacentPaths >= 2) {
                maze[y][x] = 0;
            }
        }
    }
}

// Create a special area and connect it to the maze
function createSpecialArea(centerX, centerY) {
    // Create the area
    for (let y = centerY - 1; y <= centerY + 1; y++) {
        for (let x = centerX - 1; x <= centerX + 1; x++) {
            if (isInBounds(x, y)) {
                maze[y][x] = 0;
            }
        }
    }
    
    // Ensure multiple connections to the maze
    let connections = 0;
    const requiredConnections = 2; // Minimum number of connections
    
    shuffle(directions).forEach(([dx, dy]) => {
        if (connections < requiredConnections) {
            let x = centerX + dx * 2;
            let y = centerY + dy * 2;
            if (isInBounds(x, y)) {
                maze[centerY + dy][centerX + dx] = 0;
                maze[y][x] = 0;
                connections++;
            }
        }
    });
}

// Check if coordinates are within bounds
function isInBounds(x, y) {
    return x >= 0 && y >= 0 && x < cols && y < rows;
}

// Shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Draw the maze
function drawMaze() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ECF8FF";
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 0) {
                ctx.fillRect(x * 32, y * 32, 32, 32);
            }
        }
    }
}

// Array to store special area positions
const areas = [];

// Generate new maze
function generateNewMaze() {
    areas.length = 0;
    initializeMaze();
    
    // Generate primary maze structure
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);
    generateMaze(startX, startY);
    
    // Create additional paths for better navigation
    createAdditionalPaths();
    
    // Create ally spawn area in top-left corner
    const allyX = 3;
    const allyY = 3;
    createSpecialArea(allyX, allyY);
    areas.push([allyX, allyY]);
    
    // Create enemy spawn area in bottom-right corner (modified)
    const enemyX = cols - 4;
    const enemyY = rows - 4;
    createSpecialArea(enemyX, enemyY);
    areas.push([enemyX, enemyY]);
    
    // Create crown area in the center-right
    const crownX = Math.floor(cols * 0.75);
    const crownY = Math.floor(rows * 0.5);
    createSpecialArea(crownX, crownY);
    areas.push([crownX, crownY]);
    
    drawMaze();
}

// Handle window resizing
window.addEventListener('resize', () => {
    ({ cols, rows } = resizeCanvas());
    generateNewMaze();
});

// Initial generation
generateNewMaze();