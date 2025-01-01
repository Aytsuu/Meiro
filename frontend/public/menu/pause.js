class Pause {
    constructor() {
        this.menuItems = ['Resume', 'Exit'];
        this.selectedIndex = 0;
        this.titleImage = new Image();
        this.titleImage.src = 'assets/gui/title.png';
        
        // Animation properties
        this.menuItemScales = this.menuItems.map(() => 1);
        this.menuItemOpacities = this.menuItems.map(() => 0.3);
        
        // Menu item styling
        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.fontFamily = 'Orbitron';
        this.menuSpacing = 80; // Increased spacing between menu items
        this.menuStartY = window.innerHeight * 0.65; // Moved menu below half of screen

        // Bind methods to instance
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseClick = this.mouseClick.bind(this);

    }

    mouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        
        // Calculate the scale based on the canvas size and the window size
        const scaleY = window.innerHeight / canvas.height;

        // Adjust mouse coordinates based on scaling
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Check if mouse is over any menu item
        this.menuItems.forEach((item, index) => {
            const itemY = this.menuStartY + (index * this.menuSpacing);
            if (Math.abs(mouseY - itemY) < this.fontSize) {
                this.selectedIndex = index;
            }
        });
    }

    mouseClick(e) {
        const rect = canvas.getBoundingClientRect();

        // Calculate the scale based on the canvas size and the window size
        const scaleY = window.innerHeight / canvas.height;

        // Adjust mouse coordinates based on scaling
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Handle the click event for menu items
        this.menuItems.forEach((item, index) => {
            const itemY = this.menuStartY + (index * this.menuSpacing);
            if (Math.abs(mouseY - itemY) < this.fontSize) {
                menuClickAudio.play();
                this.handleMenuSelection(index);
            }
        });
    }

    setupEventListeners() {
        canvas.addEventListener('mousemove', this.mouseMove);
        canvas.addEventListener('click', this.mouseClick);
    }
    
    handleMenuSelection(index) {
        this.removeEventListener();
        if(this.menuItems[index] === 'Resume'){
            isGamePaused = false;
        }
        else if(this.menuItems[index] === 'Exit'){
            isGamePaused = false;
            isGameOver = false;
            isGameStart = false;
            reset();
        }
    }
    
    draw() {
        // Clear canvas
        c.fillStyle = 'rgba(0,0,0,70%)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title
        const titleWidth = canvas.width * 0.2;
        const titleHeight = (titleWidth * this.titleImage.height) / this.titleImage.width;
        const titleX = (canvas.width - titleWidth) / 2;
        const titleY = canvas.height * 0.2;
        
        if (this.titleImage.complete) {
            c.drawImage(
                this.titleImage,
                titleX,
                titleY,
                titleWidth,
                titleHeight
            );
        }
        
        // Update animations
        this.menuItems.forEach((item, index) => {
            const targetScale = index === this.selectedIndex ? 1.1 : 1;
            const targetOpacity = index === this.selectedIndex ? 1 : 0.3;
            
            this.menuItemScales[index] += (targetScale - this.menuItemScales[index]) * 0.2;
            this.menuItemOpacities[index] += (targetOpacity - this.menuItemOpacities[index]) * 0.2;
        });
        
        // Draw menu items
        c.textAlign = 'center';
        
        this.menuItems.forEach((item, index) => {
            const y = this.menuStartY + (index * this.menuSpacing);
            
            c.save();
            c.translate(canvas.width / 2, y);
            c.scale(this.menuItemScales[index], this.menuItemScales[index]);
            
            c.font = `500 ${this.fontSize}px ${this.fontFamily}`;
            c.fillStyle = `rgba(255, 255, 255, ${this.menuItemOpacities[index]})`;
            
            c.fillText(item, 0, 0);
            
            c.restore();
        });
    }

    removeEventListener() {
        canvas.removeEventListener('mousemove', this.mouseMove);
        canvas.removeEventListener('click', this.mouseClick);
    }
}