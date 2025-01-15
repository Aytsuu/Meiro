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


    shadow.position = {x: canvas.width - 256, y: canvas.height - 256}
    shadow.currentHealthpoint = shadow.totalHealthpoint;
    shadow.setState(new EnemyIdleState(shadow))
    shadow.barSize.w = 50;

    shade.position = {x: canvas.width / 2, y: canvas.height / 2}
    shade.currentHealthpoint = shade.totalHealthpoint;
    shade.setState(new EnemyIdleState(shadow))
    shade.barSize.w = 50;

    shrine.position = {x: canvas.width / 2 - 30, y: canvas.height / 2}
    shrine.setState(new ChangeAnimationState(shrine))

    player.position = {x: 0, y: 0}
    player.currentHealthpoint = player.totalHealthpoint;
    player.barSize.w = 50;
    

    
    
}