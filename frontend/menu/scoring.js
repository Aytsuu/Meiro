class Score{
    constructor(){

        this.menuItems = ['Exit'];
        this.selectedIndex = 0;

        // Animation properties
        this.menuItemScales = this.menuItems.map(() => 1);
        this.menuItemOpacities = this.menuItems.map(() => 0.3);

        // Menu item styling
        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.fontFamily = 'Orbitron';
        this.menuSpacing = 80; // Increased spacing between menu items
        this.menuStartY = window.innerHeight * 0.65; // Moved menu below half of screen

        this.setupEventListeners();
    }

    draw(){
        // Update animations
        this.menuItems.forEach((item, index) => {
            const targetScale = index === this.selectedIndex ? 1.1 : 1;
            const targetOpacity = index === this.selectedIndex ? 1 : 0.3;
            
            this.menuItemScales[index] += (targetScale - this.menuItemScales[index]) * 0.2;
            this.menuItemOpacities[index] += (targetOpacity - this.menuItemOpacities[index]) * 0.2;
        });

        // Draw texts
        c.textAlign = 'center';

        c.save();
        c.font = `1 ${this.fontSize + 60}px ${this.fontFamily}`;
        c.fillStyle = `rgb(255, 255, 255)`;
        c.fillText('GAME          OVER', canvas.width / 2, canvas.height / 4 + 60); // Adjust vertical position as needed
        c.restore();

        c.save();
        c.font = `500 ${this.fontSize}px ${this.fontFamily}`;
        c.fillStyle = `rgba(255, 255, 255)`;
        c.fillText(`DEATHS:  ${totalDeath}       PARRIES:  ${totalParries}`, canvas.width / 2, canvas.height / 2); // Adjust vertical position as needed
        c.restore();
        
        this.menuItems.forEach((item, index) => {
            const y = this.menuStartY + (index * this.menuSpacing);
            
            c.save();
            c.translate(canvas.width / 2, y);
            c.scale(this.menuItemScales[index], this.menuItemScales[index]);
            
            c.font = `1 ${this.fontSize}px ${this.fontFamily}`;
            c.fillStyle = `rgba(255, 255, 255, ${this.menuItemOpacities[index]})`;
            
            c.fillText(item, 0, 0);
            
            c.restore();
        });
    }

    setupEventListeners() {
        
        if(isGameOver){
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
    }

    handleMenuSelection(index) {
        console.log(`Selected: ${this.menuItems[index]}`);
        if(index === 0){
            isGamePaused = false;
            isGameOver = false;
            isGameStart = false;
            reset();
        }
    }
}