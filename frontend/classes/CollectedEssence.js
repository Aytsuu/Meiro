class CollectedEssence extends Sprite{
    constructor({ imgSrc, frameRate, imgSize, position, animations }){
        super({ imgSrc, frameRate, animations });

        this.imgSize = imgSize;
        this.position = position;

    }
}