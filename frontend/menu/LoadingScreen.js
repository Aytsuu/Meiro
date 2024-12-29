
class LoadingScreen {
    constructor() {
        this.state = 'click';
        this.loadingProgress = 0;
        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.fontFamily = 'Orbitron';
        
        // Bind click event
        this.handleClick = this.handleClick.bind(this);
        canvas.addEventListener('click', this.handleClick);
    }
    
    handleClick() {
        if (this.state === 'click') {
            this.state = 'loading';
            this.startLoading();
        }
    }
    
    startLoading() {
        // Simulate loading progress
        const loadingInterval = setInterval(() => {
            this.loadingProgress += 1;
            
            if (this.loadingProgress >= 100) {
                clearInterval(loadingInterval);
                this.state = 'done';
                window.gameMenu = new Menu();
                canvas.removeEventListener('click', this.handleClick);
            }
        }, 30);
    }
    
    draw() {
        // Black background
        c.fillStyle = '#000000';
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text settings
        c.fillStyle = '#FFFFFF';
        c.font = `${this.fontSize}px ${this.fontFamily}`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        
        if (this.state === 'click') {
            c.fillText('Click to load assets', canvas.width / 2, canvas.height / 2);
        } 
        else if (this.state === 'loading') {
            c.fillText(`Loading game... ${this.loadingProgress}%`, canvas.width / 2, canvas.height / 2);
        }
    }
}

let loadingScreen = new LoadingScreen();
let gameMenu = null;

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    if (loadingScreen.state !== 'done') {
        loadingScreen.draw();
    } else {
        gameMenu.draw();
        gameMenu.focus();
    }
}

// Start the animation loop
animate();