class MenuSystem {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.menuItems = ['Start Game', 'Settings', 'Exit'];
        this.selectedIndex = 0;
        this.titleImage = new Image();
        this.titleImage.src = '/frontend/menu/title.png';
        
        // Animation properties
        this.menuItemScales = this.menuItems.map(() => 1);
        this.menuItemOpacities = this.menuItems.map(() => 0.3);
        
        // Set canvas size with proper pixel ratio
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Mouse and keyboard controls
        this.setupEventListeners();
        
        // Menu item styling
        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.fontFamily = 'Orbitron';
        this.menuSpacing = 80; // Increased spacing between menu items
        this.menuStartY = window.innerHeight * 0.65; // Moved menu below half of screen
        
        // Load font
        document.fonts.load(`${this.fontSize}px ${this.fontFamily}`).then(() => {
            this.animate();
        });

        // Add CSS to ensure fullscreen black background
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.overflow = 'hidden';
    }
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth; // Make canvas fill window width
        const height = window.innerHeight; // Make canvas fill window height
        
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Make canvas fill the entire window
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        
        // Position canvas to fill entire viewport
        this.canvas.style.position = 'fixed';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        
        // Update font size
        this.fontSize = Math.floor(height * 0.025);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
                    break;
                case 'ArrowDown':
                    this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
                    break;
                case 'Enter':
                    this.handleMenuSelection(this.selectedIndex);
                    break;
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scale = this.canvas.width / rect.width;
            const mouseY = (e.clientY - rect.top) * scale;
            
            this.menuItems.forEach((item, index) => {
                const itemY = this.menuStartY + (index * this.menuSpacing);
                if (Math.abs(mouseY - itemY) < this.fontSize) {
                    this.selectedIndex = index;
                }
            });
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scale = this.canvas.width / rect.width;
            const mouseY = (e.clientY - rect.top) * scale;
            
            this.menuItems.forEach((item, index) => {
                const itemY = this.menuStartY + (index * this.menuSpacing);
                if (Math.abs(mouseY - itemY) < this.fontSize) {
                    this.handleMenuSelection(index);
                }
            });
        });
    }
    
    handleMenuSelection(index) {
        console.log(`Selected: ${this.menuItems[index]}`);
        // Add your menu action handling here
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw title
        const titleWidth = this.canvas.width * 0.2;
        const titleHeight = (titleWidth * this.titleImage.height) / this.titleImage.width;
        const titleX = (this.canvas.width - titleWidth) / 2;
        const titleY = this.canvas.height * 0.2;
        
        if (this.titleImage.complete) {
            this.ctx.drawImage(
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
        this.ctx.textAlign = 'center';
        
        this.menuItems.forEach((item, index) => {
            const y = this.menuStartY + (index * this.menuSpacing);
            
            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, y);
            this.ctx.scale(this.menuItemScales[index], this.menuItemScales[index]);
            
            this.ctx.font = `500 ${this.fontSize}px ${this.fontFamily}`;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.menuItemOpacities[index]})`;
            
            this.ctx.fillText(item, 0, 0);
            
            this.ctx.restore();
        });
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the menu system when the page loads
window.addEventListener('load', () => {
    new MenuSystem();
});