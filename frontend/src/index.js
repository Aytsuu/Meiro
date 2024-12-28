// ---------------------------------------------------------------- INITIALIZATIONS ---------------------------------------------------------------- //

// Creating canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Initializing canvas and tile size
const tileSize = 128;
canvas.width = tileSize * 14;
canvas.height = tileSize * 7;

// AI training
let obstacles = []; // Store obstacles positions
let passability = []; // Store the passability of next action point (right, left, up, down)
let done = false;
let direction = 0;
let reward = 0;
let score = 0;
let steps = 0; 

// Mouse tracking
let mouseX = 0;
let mouseY = 0;

// Player
let lastPlayerDirection = 3; // Default facing front
let totalParries = 0;
let totalDeath = 0;


// Fps tracking
let lastTime = 0;
let frameCount = 0;
let fps = 0;

// Maze variables
let mazeWidth = Math.round(canvas.width / (tileSize * 2) + 1);
let mazeHeight = Math.round(canvas.height / (tileSize * 2));
let updateFlag = false;

// Create the maze
let maze = new Maze(mazeWidth, mazeHeight);
let view = new View();

// Objective
let essenceCollected = false;
let totalEssence = 0;

// Game State
let isGameOver = false;
let isGameStart = false;
let isGamePaused = false;

// Menu
const menu =  new Menu();
const scoring = new Score();
const pause = new Pause();

// Player object initialization
const player = new Player({
    imgSrc: '/frontend/assets/animations/player/idle_down.png',
    frameRate: 11, // Number of frames in the image
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
const shadow = new Enemy({
    aiId: 0,
    imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Idle-S.png',
    frameRate: 12, // Number of frames in the image
    imgSize: 256,
    position: {x: canvas.width - 256, y: canvas.height - 256},
    hitbox: {x: 100, y: 120},
    speed: 6,
    parryFrame: 14,
    audio: {attack: shadowAttackAudio, fazed: shadowFazed, warp: shadowWarpAudio},
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
        },
        warp: {
            imgSrc: '/frontend/assets/animations/enemy/Enemy-Melee-Warp.png',
            frameRate: 24,
            frameBuffer: 1,
            imgSize: 256,
        }
    }
});

const shade = new Enemy({
    aiId: 1,
    imgSrc: '/frontend/assets/animations/enemy/Shade_Idle_S.png',
    frameRate: 12, // Number of frames in the image
    imgSize: 128,
    position: {x: canvas.width / 2, y: canvas.height / 2},
    hitbox: {x: 100, y: 120},
    speed: 4,
    parryFrame: 8,
    audio: {attack: shadeAttackAudio, fazed: shadeFazed, warp: shadeWarpAudio},
    animations: {
        moveRight: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Idle_E.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        moveLeft: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Idle_W.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        moveUp: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Idle_N.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        moveDown: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Idle_S.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        attackRight: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Attack_EL.png',
            frameRate: 12,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackLeft: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Attack_WL.png',
            frameRate: 12,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackUp: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Attack_NL.png',
            frameRate: 12,  
            frameBuffer: 2,
            imgSize: 128,
        },
        attackDown: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Attack_SL.png',
            frameRate: 12,
            frameBuffer: 2,
            imgSize: 128,
        },
        fazed: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Metamorphosis.png',
            frameRate: 20,
            frameBuffer: 5,
            imgSize: 128,
        },
        warp: {
            imgSrc: '/frontend/assets/animations/enemy/Shade_Metamorphosis.png',
            frameRate: 20,
            frameBuffer: 2,
            imgSize: 128,
        }
    }
})

// Essence object initialization
const shadowEssence = new Essence({
    imgSrc: '/frontend/assets/animations/object/shadow_essence.png',
    frameRate: 30, // Number of frames in the image
    imgSize: 128,
    position: {x: shadow.position.x, y: shadow.position.y},
    hitbox: {x: 50, y: 50}
});

const shrine = new Shrine({
    imgSrc: '/frontend/assets/animations/object/no_essence.png',
    frameRate: 12, // Number of frames in the image
    imgSize: 32,
    position: {x: canvas.width / 2 - 30, y: canvas.height / 2},
    animations: {
        noEssence:{
            imgSrc: '/frontend/assets/animations/object/no_essence.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 32,
        },
        oneEssence: {
            imgSrc: '/frontend/assets/animations/object/one_essence.png',
            frameRate: 24,
            frameBuffer: 4,
            imgSize: 64,
        },
        twoEssence: {
            imgSrc: '/frontend/assets/animations/object/two_essence.png',
            frameRate: 24,
            frameBuffer: 4,
            imgSize: 64,
            
        },
        completeEssence: {
            imgSrc: '/frontend/assets/animations/object/complete_essence.png',
            frameRate: 24,
            frameBuffer: 3,
            imgSize: 64,
        }
    }
})

const interactPrompt = new Interaction({
    imgSrc: '/frontend/assets/gui/e.svg',
    frameRate: 1,
    imgSize: 64,
    position: {x: shrine.position.x - (shrine.imgSize / 2), y: shrine.position.y - (shrine.imgSize / 2)},
    animations: {
        noAction:{
            imgSrc: '/frontend/assets/gui/e.svg',
            frameRate: 1,
            imgSize: 64,
        },
        interacting: {
            imgSrc: '/frontend/assets/gui/interacting.svg',
            frameRate: 9,
            frameBuffer: 4,
            imgSize: 64,
        }
    }
})

const enemy = {
    0: shadow,
    1: shade
}

const essence = {
    0: shadowEssence
}


// Keyboard input handling for player movement
const keys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false },
    sp: { pressed: false },
    e: {pressed: false},
};

// ---------------------------------------------------------------- FUNCTIONS ---------------------------------------------------------------- //

// This function renders all objects infinitely
function animate(timestamp) {

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    if(!isGameStart) {
        maze.update();
        menu.focus();
        menu.draw();
    }
    else {
        gameStart();
        gamePause();
    }

    // Control and customize cursor for the game
    cursorControl(); 
    calculateFps(timestamp);

    window.requestAnimationFrame(animate);
}

// If start game is clicked
function gameStart(){

    // Draw the map
    maze.update();

    // Player
    playerInstance();

    // Enemy 
    enemyInstances();

    // Draw the essence
    essenceInstance();

    // Shrine
    shrineInstance();


    if(interactPrompt.canInteract(shrine)) {
        interactPrompt.draw();
        interactPrompt.update();
    }

    player.focus(); // Player fov
    
}

// If game is on ending animation
function gamePause(){

    if(isGamePaused){
        for(let i in enemy){
            enemy[i].frameRate = enemy[i].currentFrame;
        }
    
        player.frameRate = player.currentFrame;
        updateFlag = true;
        pause.draw();
    }
}

function shrineInstance(){
    if(isGameOver){
        shrine.focus()
        shrine.drawBackgroundOutro();
        shrine.update();
    }
    shrine.draw();
    // shrine.drawHitbox();
}

function playerInstance(){
    // Player
    player.movementUpdate();
    player.draw();
    // player.drawHitbox();
}

function enemyInstances(){
    for(let i in enemy){
        if(!isGamePaused) {
            enemy[i].checkPassability();
            enemy[i].decision();
            enemy[i].movementUpdate();
            enemy[i].slayPlayer(); // Attack the player
            enemy[i].train();
        }
        enemy[i].draw();
        // enemy[i].drawHitbox();
    }
}

function essenceInstance(){

    for(let i in enemy){

        try{
            if(enemy[i].essenceDropped) {
                essence[i].draw();
                essence[i].update(enemy[i]);
            }else{
                essence[i].position.x = enemy[i].position.x + enemy[i].hitbox.w / 2;
                essence[i].position.y = enemy[i].position.y + enemy[i].hitbox.h / 2;
            }
        }catch(e){}
    }
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