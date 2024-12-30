function reset(){
    

    // AI training
    obstacles = []; // Store obstacles positions
    passability = []; // Store the passability of next action point (right, left, up, down)
    done = false;
    direction = 0;
    reward = 0;
    score = 0;
    steps = 0; 
    
    // Player
    lastPlayerDirection = 3; // Default facing front
    totalParries = 0;
    totalDeath = 0

    // Objective
    essenceCollected = false;
    totalEssence = 0;

    // Game State
    isGameOver = false;
    isGameStart = false;
    isGamePaused = false;

    player.position = {x: 0, y: 0}
    shadow.position = {x: canvas.width - 256, y: canvas.height - 256}
    shadow.setState(new EnemyIdleState(shadow))

    shade.position = {x: canvas.width / 2, y: canvas.height / 2}
    shade.setState(new EnemyIdleState(shadow))

    shrine.position = {x: canvas.width / 2 - 30, y: canvas.height / 2}
    shrine.setState(new ChangeAnimationState(shrine))

    
    
}