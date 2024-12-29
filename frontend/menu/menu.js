class Menu {
    constructor() {
        // Loading screen state
        this.isLoading = true;
        this.loadingState = 'click'; // 'click' or 'loading'
        this.loadingProgress = 0;
        
        // Menu properties
        this.menuItems = ['Start Game'];
        this.selectedIndex = 0;
        this.titleImage = new Image();
        this.titleImage.src = '/frontend/assets/gui/title.png';
        
        // Animation properties
        this.menuItemScales = this.menuItems.map(() => 1);
        this.menuItemOpacities = this.menuItems.map(() => 0.3);
        
        // Menu item styling
        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.fontFamily = 'Orbitron';
        this.menuSpacing = 80;
        this.menuStartY = window.innerHeight * 0.65;

        // Setup loading screen click handler
        this.handleLoadingClick = this.handleLoadingClick.bind(this);
        canvas.addEventListener('click', this.handleLoadingClick);
    }

    handleLoadingClick() {
        if (this.isLoading && this.loadingState === 'click') {
            this.loadingState = 'loading';
            this.startLoading();
        }
    }

    startLoading() {
        const loadingInterval = setInterval(() => {
            this.loadingProgress += 1;
            
            if (this.loadingProgress >= 100) {
                clearInterval(loadingInterval);
                this.isLoading = false;
                canvas.removeEventListener('click', this.handleLoadingClick);
                this.setupEventListeners();
            }
        }, 30);
    }

    focus() { // Shadow casting
        let lightX = mouseX;
        let lightY = mouseY;

        // Create radial gradient for light
        const gradient = c.createRadialGradient(
            lightX, lightY, 150,
            lightX, lightY, 0
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(50, 50, 50, 0)');
        
        // Draw light
        c.save();
        c.globalCompositeOperation = 'darker';
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(lightX, lightY, 2000, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }

    setupEventListeners() {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scale = canvas.width / rect.width;
            const mouseY = (e.clientY - rect.top) * scale;
            
            this.menuItems.forEach((item, index) => {
                const itemY = this.menuStartY + (index * this.menuSpacing);
                if (Math.abs(mouseY - itemY) < this.fontSize) {
                    this.selectedIndex = index;
                }
            });
        });
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scale = canvas.width / rect.width;
            const mouseY = (e.clientY - rect.top) * scale;
            
            this.menuItems.forEach((item, index) => {
                const itemY = this.menuStartY + (index * this.menuSpacing);
                if (Math.abs(mouseY - itemY) < this.fontSize) {
                    menuClickAudio.play()
                    this.handleMenuSelection(index);
                }
            });
        });
    }
    
    handleMenuSelection(index) {
        console.log(`Selected: ${this.menuItems[index]}`);
        if(this.menuItems[index] === 'Start Game'){
            isGamePaused = false;
            isGameStart = true;
        }
    }
    
    draw() {
        // Only draw black background during loading screens
        if (this.isLoading) {
            // Black background
            c.fillStyle = '#000000';
            c.fillRect(0, 0, canvas.width, canvas.height);

            c.font = `${this.fontSize}px ${this.fontFamily}`;
            c.fillStyle = '#FFFFFF';
            c.textAlign = 'center';
            c.textBaseline = 'middle';
            
            if (this.loadingState === 'click') {
                c.fillText('Click to load assets', canvas.width / 2, canvas.height / 2);
            } else {
                c.fillText(`Loading game... ${this.loadingProgress}%`, canvas.width / 2, canvas.height / 2);
            }
            return;
        }
        
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
}