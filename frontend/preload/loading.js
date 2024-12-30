class Loading {
    constructor(){
        this.loadedAssets = 0;
        this.totalAssets = 0;
        this.loadingProgress = 0;
        this.loadingState = 'click';

        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.warningFontSize = Math.floor(window.innerHeight * 0.035);
        this.fontFamily = 'Orbitron';

        // Warning message
        this.warningTitle = "WARNING";
        this.warningText = "This game contains psychological horror elements, " +
        "and themes that some players may find unsettling. " +
        "Player discretion is advised. " +
        "The game is not recommended for those sensitive to horror content.";

        // Bind methods to instance
        this.handleClick = this.handleClick.bind(this);
        canvas.addEventListener('click', this.handleClick);
    }

    handleClick(){
        this.loadingState = 'loading'
        this.startLoading();
    }

    preloadAssets(assetList, callback) {
        this.totalAssets = assetList.length;
        
        assetList.forEach(asset => {
            const img = new Image();
            img.src = asset;
            img.onload = () => {
                this.loadedAssets++;
                if (this.loadedAssets === this.totalAssets) {
                    callback();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load asset: ${asset}`);
            };
        });
    }

    startLoading() {
        const loadingInterval = setInterval(() => {
            this.loadingProgress += 1;
            
            if (this.loadingProgress >= 100) {
                this.preloadAssets(assets, game);
                clearInterval(loadingInterval);
                canvas.removeEventListener('click', this.handleLoadingClick);
            }
        }, 30);
    }
    
    draw(){
        // Black background
        c.fillStyle = '#000000';
        c.fillRect(0, 0, canvas.width, canvas.height);
        
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillStyle = '#FFFFFF';

        if (this.loadingState === 'click') {
            // Draw WARNING title
            c.font = `bold ${this.warningFontSize}px ${this.fontFamily}`;
            c.fillText(this.warningTitle, canvas.width / 2, canvas.height * 0.3);

            // Draw warning message
            c.font = `${this.fontSize}px ${this.fontFamily}`;
            
            // Split warning text into lines
            const maxWidth = canvas.width * 0.8;
            const words = this.warningText.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + ' ' + words[i];
                const metrics = c.measureText(testLine);
                
                if (metrics.width > maxWidth) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            // Draw each line of the warning text
            lines.forEach((line, index) => {
                c.fillText(
                    line, 
                    canvas.width / 2, 
                    canvas.height * 0.45 + (index * this.fontSize * 1.5)
                );
            });

            // Draw "Click to proceed" at the bottom
            c.fillText(
                "Click to proceed", 
                canvas.width / 2, 
                canvas.height * 0.8
            );
        } else {
            c.font = `${this.fontSize}px ${this.fontFamily}`;
            c.fillText(
                `Loading game assets... ${this.loadingProgress}%`, 
                canvas.width / 2, 
                canvas.height / 2
            );
        }
    }
}

const loading = new Loading();

function loadingAnimation(){
    loading.draw();
    window.requestAnimationFrame(loadingAnimation);
}

loadingAnimation();