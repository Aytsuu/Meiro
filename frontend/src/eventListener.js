// // Event listener for mouse movement while drawing
canvas.addEventListener('mousemove', (e) => {

    // Getting the x and y coordinates of the cursor for cursorControl function
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    
});

// Listens to keypress
window.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w':
            keys.w.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
        case ' ':
            keys.sp.pressed = true;
            break;
        case 'e':
            keys.e.pressed = true;
            break;
    }
});


window.addEventListener('keyup', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case ' ':
            keys.sp.pressed = false;
            break;
        case 'e':
            keys.e.pressed = false;
            break;
    }
});

// Shifting the maze every 3 seconds
setInterval(() => {

    updateFlag = false

}, 3000)
