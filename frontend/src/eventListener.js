// // Event listener to resize the canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// // Event listener for when the mouse button is first pressed down
// canvas.addEventListener('mousedown', (e) => {
//     // Convert mouse click coordinates to grid-aligned coordinates
//     const gridX = Math.floor(e.offsetX / tileSize) * tileSize;
//     const gridY = Math.floor(e.offsetY / tileSize) * tileSize;
    
//     // Convert player's current position to grid coordinates
//     const playerGridX = Math.floor(player.position.x / tileSize) * tileSize;
//     const playerGridY = Math.floor(player.position.y / tileSize) * tileSize;
    
//     // Check conditions for starting path drawing:
//     if (gridX === playerGridX && gridY === playerGridY && !setMove) {
//         // Enable path drawing mode
//         isDrawingPath = true;
//         // Reset the path array
//         path = [];
//         // Add the first point to the path
//         addToPath(e.offsetX, e.offsetY);
//     }
// });

// // Event listener for mouse movement while drawing
canvas.addEventListener('mousemove', (e) => {

    // Getting the x and y coordinates of the cursor for cursorControl function
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    
//     // Only add  to path if in drawing mode
//     if (!isDrawingPath){ 
//         return;
//     }
//     else{
//         const prev_path = path.length;
//         const value = path[prev_path-1];

//         const new_path = {
//             x: (Math.floor(e.offsetX / tileSize) * tileSize),
//             y: (Math.floor(e.offsetY / tileSize) * tileSize)
//         }

//         // Prevent diagonal movements
//         if(new_path.x != value.x && new_path.y != value.y) {
//             isDrawingPath = false;
//             path = [];
//             return;
//         }

//         addToPath(e.offsetX, e.offsetY);
//     }

});

// // Event listener for when the mouse button is released
// canvas.addEventListener('mouseup', () => {
//     if (isDrawingPath) {
//         // Disable path drawing mode
//         isDrawingPath = false;
       
//         // Enable player movement
//         setMove = true;
//     }
// });


// function addToPath(x, y) {
//     // Convert mouse coordinates to grid-aligned coordinates
//     // const gridX = Math.floor(x / tileSize) * tileSize;
//     // const gridY = Math.floor(y / tileSize) * tileSize;

//     // Prevent adding more than 3 tiles
//     // if (path.length >= 4) return;

//     // Convert mouse coordinates to grid-aligned coordinates
//     toPush = {
//         x: Math.floor(x / tileSize) * tileSize,
//         y: Math.floor(y / tileSize) * tileSize
//     }

//     //checks if the tiles is null or not and prevents duplicate values within the list
//     if (path.length === 0 || 
//         (path[path.length - 1].x !== toPush.x || 
//          path[path.length - 1].y !== toPush.y) &&
//         !path.some(step => step.x === toPush.x && step.y === toPush.y)) {
    
//         path.push(toPush);

//     } 
// }

// Remove unnecessary mouse events related to path drawing
// Remove mousedown and mouseup listeners


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
    }
});


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
