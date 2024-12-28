//---------------------- MENU SHIFT AUDIO ----------------------------//

const menuClickAudio = new Audio('/frontend/assets/sounds/main menu/click.wav');


//---------------------- MAZE SHIFT AUDIO ----------------------------//

const mazeShiftAudio = new Audio('/frontend/assets/sounds/maze/shift2.wav');
mazeShiftAudio.volume = 0.6;

const mazeBGAudio = new Audio('/frontend/assets/sounds/maze/bg_sound.wav')
mazeBGAudio.volume = 0.6;
mazeBGAudio.currentTime = 0.4

//---------------------- PLAYER AUDIO ----------------------------//

const playerRunAudio = new Audio('/frontend/assets/sounds/player/running.wav');
playerRunAudio.volume = 0.7;
playerRunAudio.currentTime = 0.02;

const playerAttackAudio = new Audio('/frontend/assets/sounds/player/attack.wav');
playerAttackAudio.volume = 0.5;

const parryAudio = new Audio('/frontend/assets/sounds/player/parry3.wav');
parryAudio.volume = 0.6;


//---------------------- SHADOW AUDIO ----------------------------//

const shadowAttackAudio = new Audio('/frontend/assets/sounds/ghost/Ghost_Attack.wav');
shadowAttackAudio.volume = 0.7;
shadowAttackAudio.currentTime = 0.015;

const shadowFazed = new Audio('/frontend/assets/sounds/ghost/Ghost_Damage.wav');
shadowFazed.volume = 0.7;

const shadowWarpAudio = new Audio('/frontend/assets/sounds/ghost/Ghost_Emerge.wav');
shadowWarpAudio.volume = 0.7;

//---------------------- SHADE AUDIO ----------------------------//

const shadeAttackAudio = new Audio('/frontend/assets/sounds/redenemy/redattack.wav');
shadeAttackAudio.volume = 0.7;
shadeAttackAudio.currentTime = 0.015;

const shadeFazed = new Audio('/frontend/assets/sounds/redenemy/reddamage.wav');
shadeFazed.volume = 0.7;

const shadeWarpAudio = new Audio('/frontend/assets/sounds/redenemy/redemerge.wav');
shadeWarpAudio.volume = 0.7;