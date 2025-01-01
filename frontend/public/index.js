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
let isPlayerKilled = false;


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
    imgSrc: 'assets/animations/player/idle_down.png',
    frameRate: 11, // Number of frames in the image
    imgSize: 128,
    animations: {
        idleRight: {
            imgSrc: 'assets/animations/player/idle_right.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        idleLeft: {
            imgSrc: 'assets/animations/player/idle_left.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        idleUp: {
            imgSrc: 'assets/animations/player/idle_up.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        idleDown: {
            imgSrc: 'assets/animations/player/idle_down.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveRight: {
            imgSrc: 'assets/animations/player/move_right.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveLeft: {
            imgSrc: 'assets/animations/player/move_left.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveUp: {
            imgSrc: 'assets/animations/player/move_up.png',
            frameRate: 11,
            frameBuffer: 3,
            imgSize: 128,
        },
        moveDown: {
            imgSrc: 'assets/animations/player/move_down.png',
            frameRate: 11,
            frameBuffer: 3,
        },
        attackRight: {
            imgSrc: 'assets/animations/player/attack_right.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackLeft: {
            imgSrc: 'assets/animations/player/attack_left.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackUp: {
            imgSrc: 'assets/animations/player/attack_up.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackDown: {
            imgSrc: 'assets/animations/player/attack_down.png',
            frameRate: 11,
            frameBuffer: 2,
            imgSize: 128,
        },
    }
});

// Enemy object initialization 
const shadow = new Enemy({
    aiId: 0,
    imgSrc: 'assets/animations/enemy/Enemy-Melee-Idle-S.png',
    frameRate: 12, // Number of frames in the image
    imgSize: 256,
    position: {x: canvas.width - 256, y: canvas.height - 256},
    hitbox: {x: 100, y: 120},
    speed: 6,
    parryFrame: 14,
    audio: {attack: shadowAttackAudio, fazed: shadowFazed, warp: shadowWarpAudio},
    animations: {
        moveRight: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Idle-E.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        moveLeft: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Idle-W.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        moveUp: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Idle-N.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        moveDown: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Idle-S.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 256,
        },
        attackRight: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Attack-E.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        attackLeft: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Attack-W.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        attackUp: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Attack-N.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        attackDown: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Attack-S.png',
            frameRate: 24,
            frameBuffer: 2,
            imgSize: 256,
        },
        fazed: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Fazed.png',
            frameRate: 48,
            frameBuffer: 3,
            imgSize: 256,
        },
        warp: {
            imgSrc: 'assets/animations/enemy/Enemy-Melee-Warp.png',
            frameRate: 24,
            frameBuffer: 1,
            imgSize: 256,
        }
    }
});

const shade = new Enemy({
    aiId: 1,
    imgSrc: 'assets/animations/enemy/Shade_Idle_S.png',
    frameRate: 12, // Number of frames in the image
    imgSize: 128,
    position: {x: canvas.width / 2, y: canvas.height / 2},
    hitbox: {x: 100, y: 120},
    speed: 4,
    parryFrame: 8,
    audio: {attack: shadeAttackAudio, fazed: shadeFazed, warp: shadeWarpAudio},
    animations: {
        moveRight: {
            imgSrc: 'assets/animations/enemy/Shade_Idle_E.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        moveLeft: {
            imgSrc: 'assets/animations/enemy/Shade_Idle_W.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        moveUp: {
            imgSrc: 'assets/animations/enemy/Shade_Idle_N.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        moveDown: {
            imgSrc: 'assets/animations/enemy/Shade_Idle_S.png',
            frameRate: 12,
            frameBuffer: 5,
            imgSize: 128,
        },
        attackRight: {
            imgSrc: 'assets/animations/enemy/Shade_Attack_EL.png',
            frameRate: 12,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackLeft: {
            imgSrc: 'assets/animations/enemy/Shade_Attack_WL.png',
            frameRate: 12,
            frameBuffer: 2,
            imgSize: 128,
        },
        attackUp: {
            imgSrc: 'assets/animations/enemy/Shade_Attack_NL.png',
            frameRate: 12,  
            frameBuffer: 2,
            imgSize: 128,
        },
        attackDown: {
            imgSrc: 'assets/animations/enemy/Shade_Attack_SL.png',
            frameRate: 12,
            frameBuffer: 2,
            imgSize: 128,
        },
        fazed: {
            imgSrc: 'assets/animations/enemy/Shade_Metamorphosis.png',
            frameRate: 20,
            frameBuffer: 5,
            imgSize: 128,
        },
        warp: {
            imgSrc: 'assets/animations/enemy/Shade_Metamorphosis.png',
            frameRate: 20,
            frameBuffer: 2,
            imgSize: 128,
        }
    }
})

// Essence object initialization
const shadowEssence = new Essence({
    imgSrc: 'assets/animations/object/shadow_essence.png',
    frameRate: 30, // Number of frames in the image
    imgSize: 128,
    position: {x: shadow.position.x, y: shadow.position.y},
    hitbox: {x: 50, y: 50}
});

const collectedEssence = new CollectedEssence({
    imgSrc: 'assets/animations/object/collected_essence.png',
    frameRate: 30, // Number of frames in the image
    imgSize: 32,
    position: {x: 0, y: 0},
});

const shrine = new Shrine({
    imgSrc: 'assets/animations/object/no_essence.png',
    frameRate: 12, // Number of frames in the image
    imgSize: 32,
    position: {x: canvas.width / 2 - 30, y: canvas.height / 2},
    animations: {
        noEssence:{
            imgSrc: 'assets/animations/object/no_essence.png',
            frameRate: 12,
            frameBuffer: 4,
            imgSize: 32,
        },
        oneEssence: {
            imgSrc: 'assets/animations/object/one_essence.png',
            frameRate: 24,
            frameBuffer: 4,
            imgSize: 64,
        },
        twoEssence: {
            imgSrc: 'assets/animations/object/two_essence.png',
            frameRate: 24,
            frameBuffer: 4,
            imgSize: 64,
            
        },
        completeEssence: {
            imgSrc: 'assets/animations/object/complete_essence.png',
            frameRate: 24,
            frameBuffer: 3,
            imgSize: 64,
        }
    }
})

const interactPrompt = new Interaction({
    imgSrc: 'assets/gui/e.svg',
    frameRate: 1,
    imgSize: 64,
    position: {x: shrine.position.x - (shrine.imgSize / 2), y: shrine.position.y - (shrine.imgSize / 2)},
    animations: {
        noAction:{
            imgSrc: 'assets/gui/e.svg',
            frameRate: 1,
            imgSize: 64,
        },
        interacting: {
            imgSrc: 'assets/gui/interacting.svg',
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


function game(){
    
    // This function renders all objects infinitely
    function animate(timestamp) {

        // Clear the canvas
        c.clearRect(0, 0, canvas.width, canvas.height);

        if(!isGameStart) {
            maze.update();
            menu.setupEventListeners();
            menu.focus();
            menu.draw();
        }
        else {
            gameStart();
            gamePause();
        }

        // Control and customize cursor for the game
        cursorControl(); 

        // Calculate game fps
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

        shrineInteraction();

        if(!isGameOver) player.focus(); // Player fov

        if(isPlayerKilled) player.drawDeathEffect();
        
    }

    function gamePause(){

        if(isGamePaused && !isGameOver){ // Check if game paused
            pause.setupEventListeners();
            for(let i in enemy){
                enemy[i].frameRate = enemy[i].currentFrame;
            }
        
            player.frameRate = player.currentFrame;
            updateFlag = true;
            pause.draw();
        }
    }

    function shrineInteraction(){
        if(interactPrompt.canInteract(shrine)) {
            interactPrompt.draw();
            interactPrompt.update();
        }
    }

    function shrineInstance(){
        if(isGameOver){
            shrine.focus()
            shrine.drawBackgroundOutro();
            shrine.update();
        }
        shrine.drawProgress();
        shrine.draw();
        // shrine.drawHitbox();
    }

    function playerInstance(){

        if(!isPlayerKilled){
            // Player
            if(essenceCollected) {
                collectedEssence.position.x = player.position.x + player.imgSize / 2 - 15;
                collectedEssence.position.y = player.position.y + ((player.imgSize - player.hitbox.h) / 2) - 25;
                collectedEssence.draw();
            }
            player.movementUpdate();
            player.draw();
            // player.drawHitbox();
        }
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

        if(!isGameStart || isGamePaused || isGameOver){
            // Create cursor image
            const cursorImg = new Image();
            cursorImg.src = 'assets/gui/cursor.png';
            
            // Draw cursor
            c.drawImage(cursorImg, mouseX - cursorImg.width/2, mouseY - cursorImg.height/2);
        }
    }

    // Start the game
    animate();
}


if (window.location.hostname !== '127.0.0.1') {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // Prevent right-click
    });
}
    