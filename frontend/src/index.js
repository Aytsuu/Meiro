
// Creating canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const tileSize = 128

// Initializing canvas and tile size
canvas.width = tileSize * 14;
canvas.height = tileSize * 7;

// Initializing global variables
let setMove = false
let path = []; // Stores the path points as an array of grid positions
let obstacles = [] // Store obstacles positions
let passability = [] // Store the passability of next action point (straight, right, left)
let mouseX = 0;
let mouseY = 0;
let imageLoaded = false;
let isGameOver = false;
let direction = 0;
let reward = 0;
let score = 0;
let steps = 0;
let phase = 1; // Training Phase
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
            frameBuffer: 3,
            imgSize: 128,
        },
        attackRight: {
            imgSrc: '/frontend/assets/animations/player/attack_right.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackLeft: {
            imgSrc: '/frontend/assets/animations/player/attack_left.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackUp: {
            imgSrc: '/frontend/assets/animations/player/attack_up.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackDown: {
            imgSrc: '/frontend/assets/animations/player/attack_down.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
    }
})


// Enemy object initialization 
const enemy = new Enemy({
    imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-S.png',
    frameRate: 12, // Number of actions in the image
    imgSize: 256,
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
})

// Crown object initialization
const crown = new Crown({
    imgSrc: '/frontend/assets/animations/Crown_Gold.png',
    frameRate: 1// Number of actions in the image
})

// Keyboard input handling for player movement
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    sp: { pressed: false },
};

// This function renders all objects infinitely
function animate(timestamp) {
    window.requestAnimationFrame(animate);

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the map and the path
    drawMap();
    // drawPath();
    
    // enemy.drawHitbox();

    // Update and draw the player
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

    // Draw the crown object
    crown.draw();

    // Kill the player
    enemy.slayPlayer();

    // Control and customize cursor for the game
    cursorControl();
    calculateFps(timestamp);
}

function calculateFps(timestamp){
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
    // Confine mouse within canvas boundaries
    if (mouseX < 0) mouseX = 0;
    if (mouseX > canvas.width) mouseX = canvas.width;
    if (mouseY < 0) mouseY = 0;
    if (mouseY > canvas.height) mouseY = canvas.height;

    // Draw a small circle at the mouse position
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
    console.log('FPS:', fps);  // Display the FPS every second
}

// Function to draw the path on the grid
// function drawPath() {

//     if(!isEnemyTurn){
//         // Set the stroke color for the path
//         c.fillStyle = '#93CBDF';
//         c.strokeStyle = '#93CBDF';
//         c.beginPath();

//         // Loop through each point in the path

//         for (let i = 0; i < path.length; i++) {
//             const point = path[i];
            
//             // Render the path on the canvas
//             c.fillRect((point.x/tileSize) * tileSize, (point.y/tileSize) * tileSize, tileSize, tileSize)

//         }
//     }
// }


setInterval(displayFPS, 1000);  // Update FPS display every second

// resizeCanvas(); // Initial canvas size setup

animate() // Function calling
