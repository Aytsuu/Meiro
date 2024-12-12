// Listens click event
canvas.addEventListener('click', (e) => {

    // Takes the position x and y where mouse click occured 
    currentX = e.offsetX
    currentY = e.offsetY
    setMove = true // Enable movement
})

// // Listens to mouse down event
// canvas.addEventListener('mousedown', (e) => {

//     isDragging = true
//     currentX = e.offsetX
//     currentY = e.offsetY
// })

// canvas.addEventListener('mousemove', (e) => {
//     if (!isDragging) return

//     const deltaX = e.clientX - startX
//     const deltaY = e.clientY - startY

//     console.log(isDragging)
//     console.log(deltaX, deltaY)
// })

// canvas.addEventListener('mouseup', (e) => {
//     if (!isDragging) return

//     isDragging = false
//     offsetX = e.clientX
//     offsetY = e.clientY 

//     console.log(offsetX, offsetY)
//     setMove = true
// })
