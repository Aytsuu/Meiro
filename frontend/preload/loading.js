class Loading{
    constructor(){

        this.loadedAssets = 0;
        this.totalAssets = 0;
        this.loadingProgress = 0;
        this.loadingState = 'click';

        this.fontSize = Math.floor(window.innerHeight * 0.025);
        this.fontFamily = 'Orbitron';

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
        
        // Loading the assets to the browser
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

        // Initiates loading animation
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
    
        //Displays loading screen
        c.fillStyle = '#000000';
        c.fillRect(0, 0, canvas.width, canvas.height);
    
        c.font = `${this.fontSize}px ${this.fontFamily}`;
        c.fillStyle = '#FFFFFF';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        
        if (this.loadingState === 'click') {
            c.fillText('Click to load assets', canvas.width / 2, canvas.height / 2);
        } else {
            c.fillText(`Loading game assets... ${this.loadingProgress}%`, canvas.width / 2, canvas.height / 2);
        }
    }
    
    
}


const loading = new Loading();

function loadingAnimation(){

    loading.draw();

    window.requestAnimationFrame(loadingAnimation);
}

loadingAnimation();
 