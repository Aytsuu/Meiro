
// Creating canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Initializing canvas and tile size
const tileSize = 128;
canvas.width = tileSize * 14;
canvas.height = tileSize * 7;

// Initializing global variables
let obstacles = []; // Store obstacles positions
let passability = []; // Store the passability of next action point (right, left, up, down)
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

// Maze variables
let mazeWidth = Math.round(canvas.width / (tileSize * 2) + 1);
let mazeHeight = Math.round(canvas.height / (tileSize * 2));
let updateFlag = false;

// Create the maze
let maze = new Maze(mazeWidth, mazeHeight);
let view = new View();

// Object variables
let essencePicked = false

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
});

// Enemy object initialization 
const enemy = new Enemy({
    imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-S.png',
    frameRate: 12, // Number of actions in the image
    imgSize: 256,
    position: {x: canvas.width - 256, y: canvas.height - 256},
    hitbox: {x: 100, y: 120},
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
const shadowEssence = new Object({
    imgSrc: '/frontend/assets/animations/object/shadow_essence.png',
    frameRate: 30, // Number of actions in the image
    imgSize: 128,
    position: {x: enemy.position.x, y: enemy.position.y},
    hitbox: {x: 50, y: 50}
});

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
    
    // Draw the map
    maze.update();


    // Draw the enemy and handle its turn
    enemy.checkPassability();
    enemy.decision();
    enemy.movementUpdate();
    enemy.train();
    // enemy.drawHitbox();

    // Update and draw the player
    player.movementUpdate();
    player.draw();

    enemy.draw();

    // Draw the shadow essence object
    if(isParried) {
        shadowEssence.draw();
        shadowEssence.pickObject();
    }else{
        shadowEssence.position.x = enemy.position.x + enemy.hitbox.w / 2;
        shadowEssence.position.y = enemy.position.y + enemy.hitbox.h / 2;
    }

    player.focus();
    // player.drawHitbox();


    // Kill the player
    enemy.slayPlayer();

    // Control and customize cursor for the game
    cursorControl();
    calculateFps(timestamp);
}

function shiftMap(){
    for(let i = 0; i < algorithmIterations; i++){
        maze.iterate();
    }
    view.drawMaze(maze);
}

function calculateFps(timestamp) { // Fps tracker
    frameCount++;
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = timestamp;
    }
}

function cursorControl() {

    // Confine mouse within canvas boundaries
    if (mouseX < 0) mouseX = 0;
    if (mouseX > canvas.width) mouseX = canvas.width;
    if (mouseY < 0) mouseY = 0;
    if (mouseY > canvas.height) mouseY = canvas.height;

    // Draw a small circle at the mouse position
    c.beginPath();
    c.arc(mouseX, mouseY, 5, 0, Math.PI * 2);
    c.fillStyle = 'red';
    c.fill();
}

function displayFPS() {
    console.log('FPS:', fps);
}

setInterval(displayFPS, 1000); // Update FPS display every second

// Start the game
animate();