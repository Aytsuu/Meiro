
// Creating canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Constants
const tileSize = 32;
const pathDensity = 0.35;

// Resize canvas and initialize maze dimensions
function resizeCanvas() {
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
            nx > 1 && ny > 1 && nx < cols - 2 && ny < rows - 2) {
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
        const x = 2 + Math.floor(Math.random() * (cols - 4));
        const y = 2 + Math.floor(Math.random() * (rows - 4));
        
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
function createSpecialArea(centerX, centerY) {
    for (let y = centerY - 1; y <= centerY + 1; y++) {
        for (let x = centerX - 1; x <= centerX + 1; x++) {
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
let action = [0, 0, 0, 0];
let isNearPlayer = false;
let lastPlayerDirection = 3;

// Fps tracking
let lastTime = 0;
let frameCount = 0;
let fps = 0;

// Player object initialization
const player = new Player({
    imgSrc: '/frontend/assets/animations/player/idle_down.png',
    frameRate: 11,
    role: 'player',
    animations: {
        idleRight: {
            imgSrc: '/frontend/assets/animations/player/idle_right.png',
            frameRate: 11,
            frameBuffer: 4,
        },
        idleLeft: {
            imgSrc: '/frontend/assets/animations/player/idle_left.png',
            frameRate: 11,
            frameBuffer: 4,
        },
        idleUp: {
            imgSrc: '/frontend/assets/animations/player/idle_up.png',
            frameRate: 11,
            frameBuffer: 4,
        },
        idleDown: {
            imgSrc: '/frontend/assets/animations/player/idle_down.png',
            frameRate: 11,
            frameBuffer: 4,
        },
        moveRight: {
            imgSrc: '/frontend/assets/animations/player/move_right.png',
            frameRate: 11,
            frameBuffer: 4,
        },
        moveLeft: {
            imgSrc: '/frontend/assets/animations/player/move_left.png',
            frameRate: 11,
            frameBuffer: 4,
        },
        moveUp: {
            imgSrc: '/frontend/assets/animations/player/move_up.png',
            frameRate: 11,
            frameBuffer: 4,
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
    frameRate: 12,
    role: 'enemy',
    animations: {
        moveRight: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-E.png',
            frameRate: 12,
            frameBuffer: 4,
        },
        moveLeft: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-W.png',
            frameRate: 12,
            frameBuffer: 4,
        },
        moveUp: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-N.png',
            frameRate: 12,
            frameBuffer: 4,
        },
        moveDown: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-S.png',
            frameRate: 12,
            frameBuffer: 4,
        },
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
    const allyY = 3;
    createSpecialArea(allyX, allyY);
    
    const enemyX = cols - 4;
    const enemyY = rows - 4;
    createSpecialArea(enemyX, enemyY);
    
    const crownX = Math.floor(cols * 0.75);
    const crownY = Math.floor(rows * 0.5);
    createSpecialArea(crownX, crownY);
    
    // Set initial positions
    player.position = {
        x: allyX * tileSize,
        y: allyY * tileSize
    };
    
    enemy.position = {
        x: enemyX * tileSize,
        y: enemyY * tileSize
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
    player.draw();
    player.movementUpdate();
    
    enemy.checkPassability();
    enemy.decision();
    enemy.action();
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

setInterval(displayFPS, 1000);

// Start the game
initGame();