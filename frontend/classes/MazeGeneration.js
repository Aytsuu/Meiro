class View {

    drawBackground() {
        c.strokeStyle = 'white'
        c.fillStyle = "rgb(50, 50, 50)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        // for(let i = 0; i < canvas.height; i += tileSize){
        //     for(let j = 0; j < canvas.width; j += tileSize){
        //         c.strokeRect(j, i, tileSize, tileSize)
        //     }
        // }
    }
  
    drawMaze(maze) {

        // calculate values
        let size = canvas.height / maze.height;
        size = Math.round(size);
        let lineWidth = Math.ceil(size / 15);
  
        this.drawBackground();
  
        c.fillStyle = "rgb(0, 255, 255)";
        c.strokeStyle = "rgb(0, 255, 255)";
        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                let node = maze.map[y][x];
                let xPos = x * size + size / 2;
                let yPos = y * size + size / 2;

                // Get the line segment representing the wall
                let wallX = xPos + node.direction.x * size;
                let wallY = yPos + node.direction.y * size;

                c.beginPath();
                c.fillRect(xPos - 7.5, yPos - 7.5, lineWidth, lineWidth);

        
                // draw path
                c.beginPath();
                c.lineWidth = lineWidth;
                c.moveTo(xPos, yPos);
                c.lineTo(wallX, wallY);
                c.stroke();
            }
        }
    }
  }
  
  class Node {
      constructor(directionX = 0, directionY = 0) {
          this.direction = {x: directionX, y: directionY};
      }
  
      setDirection(x, y) {
          this.direction.x = x;
          this.direction.y = y;

      }
  }
  
  class Maze {
      constructor(width, height) {
          this.width = width;
          this.height = height;
          this.algorithmIterations =  this.width * this.height * 10; // how many iterations should be performed when running the algorithm
          this.map = this.newMap(); // the array of nodes defining the maze
          this.origin = {x: this.width - 1, y: this.height - 1}; // position of the origin point
          this.nextOrigin = {x: null, y: null}; // position of the next origin point. this is defined here to improve performance
          this.possibleDirections = [
              {x: -1, y: 0},
              {x: 0, y: -1},
              {x: 1, y: 0},
              {x: 0, y: 1}
          ]; // an array containing the possible directions the origin can travel in
      }
  
      // returns a map of a valid maze
      newMap() {
          let map = [];
          for (let y = 0; y < this.height; y++) {
              map.push([]);
              for (let x = 0; x < this.width - 1; x++) {
                  map[y].push(new Node(1, 0));
              }
              map[y].push(new Node(0, 1));
          }
          map[this.height - 1][this.width - 1].setDirection(0, 0);
  
          return map;
      }
  
      setOrigin(x, y) {
          this.origin.x = x;
          this.origin.y = y;
      }
  
      setNextOrigin(x, y) {
          this.nextOrigin.x = x;
          this.nextOrigin.y = y;
      }
  
      // performs one iteration of the algorithm
      iterate() {
          // select a random direction
          let direction = this.possibleDirections[this.getRandomInt(0, this.possibleDirections.length)];
          
          // check if out of bounds
          this.setNextOrigin(this.origin.x + direction.x, this.origin.y + direction.y);
          if (this.nextOrigin.x < 0 || this.nextOrigin.x >= this.width || this.nextOrigin.y < 0 || this.nextOrigin.y >= this.height) return;
  
          // set the origin nodes direction to this direction
          this.map[this.origin.y][this.origin.x].setDirection(direction.x, direction.y);
  
          // the node in this direction becomes the new origin node
          this.setOrigin(this.nextOrigin.x, this.nextOrigin.y);
          this.map[this.origin.y][this.origin.x].setDirection(0, 0);
      }
  
      update(){ // Shift maze
  
        if(!updateFlag){
          for(let i = 0; i < this.algorithmIterations; i++){
            maze.iterate();
          }
          updateFlag = true;
          console.log(maze)
        }
        view.drawMaze(maze);
  
      }
  
      // helpers
      getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min); // min inclusive, max exclusive
      }
  }
  
  
  