// Event listener to resize the canvas when the window is resized
window.addEventListener('resize', resizeCanvas);

// Event listener for when the mouse button is first pressed down
canvas.addEventListener('mousedown', (e) => {
    // Convert mouse click coordinates to grid-aligned coordinates
    const gridX = Math.floor(e.offsetX / tileSize) * tileSize;
    const gridY = Math.floor(e.offsetY / tileSize) * tileSize;
    
    // Convert player's current position to grid coordinates
    const playerGridX = Math.floor(player.position.x / tileSize) * tileSize;
    const playerGridY = Math.floor(player.position.y / tileSize) * tileSize;
    
    // Check conditions for starting path drawing:
    if (gridX === playerGridX && gridY === playerGridY && !setMove) {
        // Enable path drawing mode
        isDrawingPath = true;
        // Reset the path array
        path = [];
        // Add the first point to the path
        addToPath(e.offsetX, e.offsetY);
    }
});

//     // Takes the position x and y where mouse click occured 
//     currentX = e.offsetX
//     currentY = e.offsetY
//     setMove = true // Enable movement
// })

// Event listener for mouse movement while drawing
canvas.addEventListener('mousemove', (e) => {

    
    // Only add  to path if in drawing mode
    if (!isDrawingPath){ 
        return;
    }
    else{
        const prev_path = path.length;
        const value = path[prev_path-1];

        // console.log(value.x, value.y)

        const new_path = {
            x: (Math.floor(e.offsetX / tileSize) * tileSize),
            y: (Math.floor(e.offsetY / tileSize) * tileSize)
        }
        
        // console.log('Horizontal', new_path.x,value.x)
        // console.log('Vertical', new_path.y,value.y)

        if(new_path.x != value.x && new_path.y != value.y) {
            isDrawingPath = false;
            path = [];
            return;
        }

        addToPath(e.offsetX, e.offsetY);
    }

});

// Event listener for when the mouse button is released
canvas.addEventListener('mouseup', () => {
    if (isDrawingPath) {
        // Disable path drawing mode
        isDrawingPath = false;
       
        // Enable player movement
        setMove = true;
    }
});


function addToPath(x, y) {
    // Convert mouse coordinates to grid-aligned coordinates
    // const gridX = Math.floor(x / tileSize) * tileSize;
    // const gridY = Math.floor(y / tileSize) * tileSize;

    // Prevent adding more than 3 tiles
    // if (path.length >= 4) return;

    // Convert mouse coordinates to grid-aligned coordinates
    toPush = {
        x: Math.floor(x / tileSize) * tileSize,
        y: Math.floor(y / tileSize) * tileSize
    }

    //checks if the tiles is null or not and prevents duplicate values within the list
    if (path.length === 0 || 
        (path[path.length - 1].x !== toPush.x || 
         path[path.length - 1].y !== toPush.y) &&
        !path.some(step => step.x === toPush.x && step.y === toPush.y)) {
    
        path.push(toPush);

        sendData()
    } 
}
