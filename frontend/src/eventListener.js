canvas.addEventListener('click', (e) => {
    currentX = e.offsetX
    currentY = e.offsetY
    console.log(e.offsetX)
    console.log(e.offsetY)
    setMove = true
})

// canvas.addEventListener('m', (e) => {
//     if(isDragging){
//         currentX = e.offsetX
//         currentY = e.offsetY
//         console.log(e.offsetX)
//         console.log(e.offsetY)
//         isDragging = false
//     }
// })
