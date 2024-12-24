
// Creating canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Constants
const tileSize = 62;  // Reduced from 64 to make cells smaller
const pathDensity = 0.32;  // Slightly reduced to make fewer open spaces

// Resize canvas and initialize maze dimensions
function resizeCanvas() {
    // Modified to fit window more precisely
    canvas.width = Math.ceil(window.innerWidth / tileSize) * tileSize;
    canvas.height = Math.ceil(window.innerHeight / tileSize) * tileSize;
    
    const cols = Math.floor(canvas.width / tileSize);
    const rows = Math.floor(canvas.height / tileSize);
    
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

// Generate primary maze path using recursive backtracking
function generateMaze(x, y) {
    maze[y][x] = 0;
    
    const shuffledDirs = shuffleWithBias([...directions]);
    
    shuffledDirs.forEach(([dx, dy]) => {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        
        if (isInBounds(nx, ny) && maze[ny][nx] === 1 &&
            nx > 0 && ny > 0 && nx < cols - 1 && ny < rows - 1) {
            maze[y + dy][x + dx] = 0;
            generateMaze(nx, ny);
        }
    });
}

// Shuffle with slight bias towards horizontal movement
function shuffleWithBias(array) {
    const biasedArray = [...array];
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i][0] !== 0) {
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
        const x = 1 + Math.floor(Math.random() * (cols - 1));
        const y = 1 + Math.floor(Math.random() * (rows - 1));

        if (maze[y][x] === 1) {
            let adjacentPaths = 0;
            directions.forEach(([dx, dy]) => {
                if (isInBounds(x + dx, y + dy) && maze[y + dy][x + dx] === 0) {
                    adjacentPaths++;
                }
            });
            
            if (adjacentPaths >= 2) {
                maze[y][x] = 0;
            }
        }
    }
}

// Create a special area and connect it to the maze
function createSpecialArea(centerX, centerY, size = 1) {
    for (let y = centerY - size; y <= centerY + size; y++) {
        for (let x = centerX - size; x <= centerX + size; x++) {
            if (isInBounds(x, y)) {
                maze[y][x] = 0;
            }
        }
    }

    let connections = 0;
    const requiredConnections = 2;

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
    c.fillStyle = "#1B1B1B";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.fillStyle = "#ECF8FF";
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 0) {
                c.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}

// Initializing global variables
let setMove = false;
let path = [];
let obstacles = [];
let passability = [];
let mouseX = 0;
let mouseY = 0;
let imageLoaded = false;
let isGameOver = false;
let direction = 0;
let reward = 0;
let score = 0;
let steps = 0;
let phase = 1;
let n_games = 0;
let isNearPlayer = false;
let lastPlayerDirection = 3 // Default facing front

// Fps tracking
let lastTime = 0;
let frameCount = 0;
let fps = 0;

// Attacking
let enemyAttackFlag = 0;
let isEnemyAttack = false;
let isParried = false

// NPC Action
let action=[0,0,0,0];
let prev_action = [];


// Player object initialization
const player = new Player({
    imgSrc: '/frontend/assets/animations/player/idle_down.png',
    frameRate: 11, // Number of actions in the image
    imgSize: 128,
    animations: {
        idleRight: {
            imgSrc: '/frontend/assets/animations/player/idle_right.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        idleLeft: {
            imgSrc: '/frontend/assets/animations/player/idle_left.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        idleUp: {
            imgSrc: '/frontend/assets/animations/player/idle_up.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        idleDown: {
            imgSrc: '/frontend/assets/animations/player/idle_down.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveRight: {
            imgSrc: '/frontend/assets/animations/player/move_right.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveLeft: {
            imgSrc: '/frontend/assets/animations/player/move_left.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveUp: {
            imgSrc: '/frontend/assets/animations/player/move_up.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveDown: {
            imgSrc: '/frontend/assets/animations/player/move_down.png',
            frameRate: 11,
            frameBuffer: 4,
        }
    }
});

// Enemy object initialization 
const enemy = new Enemy({
    imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-S.png',
    frameRate: 12, // Number of actions in the image
    role: 'enemy',
    animations: {
        moveRight: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-E.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        moveLeft: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-W.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        moveUp: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-N.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        moveDown: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-S.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        attackRight: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Attack-E.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        attackLeft: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Attack-W.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        attackUp: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Attack-N.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        attackDown: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Attack-S.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        fazed: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Fazed.png',
            frameRate: 48,
            frameBuffer: 3,
            imgSize: 256,
        }

    }
});

// Crown object initialization
const crown = new Crown({
    imgSrc: '/frontend/assets/animations/Crown_Gold.png',
    frameRate: 1
});

// Keyboard input handling
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    sp: { pressed: false },
};

// Generate new maze and set initial positions
function generateNewMaze() {
    // Clear existing maze
    maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    
    // Generate primary maze structure
    generateMaze(Math.floor(cols / 2), Math.floor(rows / 2));
    createAdditionalPaths();
    
    // Create spawn areas and set positions
    const allyX = 3;
    const allyY = 4;
    createSpecialArea(allyX, allyY);
    
    const enemyX = cols - 5;
    const enemyY = rows - 4;
    createSpecialArea(enemyX, enemyY);
    
    const crownX = Math.floor(cols * 0.7);
    const crownY = Math.floor(rows * 0.45);
    createSpecialArea(crownX, crownY);
    
    // Set initial positions
    player.position = {
        x: allyX * 35,
        y: allyY * 40
    };
    
    enemy.position = {
        x: enemyX * 60,
        y: enemyY * 60
    };
    
    crown.position = {
        x: crownX * tileSize,
        y: crownY * tileSize
    };
}

function animate(timestamp) {
    window.requestAnimationFrame(animate);
    
    // Draw the maze
    drawMaze();
    
    // Update and draw game objects
    player.movementUpdate();
    player.focus();
    player.draw();
    // player.drawHitbox();

    // Draw the enemy and handle its turn
    enemy.checkPassability();
    enemy.decision();
    enemy.movementUpdate();
    enemy.train();
    enemy.draw();
    
    crown.draw();
    
    enemy.slayPlayer();
    cursorControl();
    calculateFps(timestamp);
}

function calculateFps(timestamp) {
    frameCount++;
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = timestamp;
    }
}

// function resizeCanvas() {

//     if (!imageLoaded) return;
//     // Calculate the canvas size based on the window size
//     canvas.width = Math.floor(window.innerWidth / tileSize) * tileSize; // Full-width based on tile size
//     canvas.height = Math.floor(window.innerHeight / tileSize) * tileSize; // Full-height based on tile size

//     // Recalculate the grid size (number of tiles in rows and columns)
//     player.size.width = tileSize;
//     player.size.height = tileSize;
//     enemy.size.width = tileSize;
//     enemy.size.height = tileSize;
// }

function cursorControl() {
    if (mouseX < 0) mouseX = 0;
    if (mouseX > canvas.width) mouseX = canvas.width;
    if (mouseY < 0) mouseY = 0;
    if (mouseY > canvas.height) mouseY = canvas.height;

    c.beginPath();
    c.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
}

// Function to draw the map/grid
function drawMap() {
    // Loop through each row and column of tiles
    for (let i = 0; i < canvas.height / tileSize; i++) {
        for (let j = 0; j < canvas.width / tileSize; j++) {
            c.fillStyle = 'rgb(1,1,1)'
            // c.strokeStyle = 'white'
            // c.strokeRect(j * tileSize, i * tileSize, tileSize, tileSize)
            c.fillRect(j * tileSize, i * tileSize, tileSize, tileSize)
        }
    }
}

function displayFPS() {
    console.log('FPS:', fps);
}

// Initialize the game
function initGame() {
    resizeCanvas();
    generateNewMaze();
    animate();
}

// Event listeners
window.addEventListener('resize', () => {
    ({ cols, rows } = resizeCanvas());
    generateNewMaze();
});

setInterval(displayFPS, 1000); // Update FPS display every second

// Start the game
initGame();