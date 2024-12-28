function preloadAssets(assetList, callback) {
    let loadedAssets = 0;
    const totalAssets = assetList.length;

    assetList.forEach(asset => {
        const img = new Image();
        img.src = asset;
        img.onload = () => {
            loadedAssets++;
            if (loadedAssets === totalAssets) {
                callback();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load asset: ${asset}`);
        };
    });
}