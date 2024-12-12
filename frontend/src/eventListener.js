// Event listener for when the mouse button is first pressed down
canvas.addEventListener('mousedown', (e) => {
    // Convert mouse click coordinates to grid-aligned coordinates
    const gridX = Math.floor(e.offsetX / tileSize) * tileSize;
    const gridY = Math.floor(e.offsetY / tileSize) * tileSize;
    
    // Convert player's current position to grid coordinates
    const playerGridX = Math.floor(player.position.x / tileSize) * tileSize;
    const playerGridY = Math.floor(player.position.y / tileSize) * tileSize;
    
    // Check conditions for starting path drawing:
    // 1. Mouse click is on the player's current tile
    // 2. Player is not currently moving
    if (gridX === playerGridX && gridY === playerGridY && !setMove) {
        // Enable path drawing mode
        isDrawingPath = true;
        // Reset the path array
        path = [];
        // Add the first point to the path
        addToPath(e.offsetX, e.offsetY);
    }
});

// Event listener for mouse movement while drawing
canvas.addEventListener('mousemove', (e) => {
    // Only add  to path if in drawing mode
    if (!isDrawingPath) return;
    addToPath(e.offsetX, e.offsetY);
});

// Event listener for when the mouse button is released
canvas.addEventListener('mouseup', () => {
    if (isDrawingPath) {
        // Disable path drawing mode
        isDrawingPath = false;
       
        if (path.length > 1 && path.length <= 4) {
            // Enable player movement
            setMove = true;
        } else {
            // Clear invalid path
            path = [];
        }
    }
});


function addToPath(x, y) {
    // Convert mouse coordinates to grid-aligned coordinates
    const gridX = Math.floor(x / tileSize) * tileSize;
    const gridY = Math.floor(y / tileSize) * tileSize;

    // Prevent adding more than 3 tiles
    if (path.length >= 4) return;

    //checks if the tiles is null or not
    if (path.length === 0 || 
        (path[path.length - 1].x !== gridX || 
         path[path.length - 1].y !== gridY)) {
        path.push({ x: gridX, y: gridY });
    }
}