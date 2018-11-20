import createjs from './createjs.js'
import settings from './settings.js'
import CSpriteLibrary from './sprite_lib.js'
import CBasket from './CBasket.js'

function CScoreBasketController(oParentContainer) {
    this.state = {
        baskets: []
    }

    this.initBasketController = function(oParentContainer) {
        const container = new createjs.Container();
        container.y = 1472;
        oParentContainer.addChild(container);
        
        const basketSprite = CSpriteLibrary.getSprite('basket_display');
        const iWidth = basketSprite.width / 4;
        const iHeight = basketSprite.height;

        const spriteSheet = new createjs.SpriteSheet({
            images: [basketSprite], 
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
            animations: {state_off:[0],state_green:[1], state_yellow:[2], state_red:[3]}
        });
        
        for (let i = 0; i < settings.getPrize().length; i += 1) {
            this.state.baskets.push(new CBasket(290 + i * 140, 0, container, spriteSheet, iWidth, iHeight, settings.getPrize()[i].background));
        };
    };
    
    this.unload = () => {
        for (let i = 0; i < settings.getPrize().length; i += 1) {
            this.state.baskets[i].unload();
        };
    };
    
    this.litBasket = (iIndex, bWin) => {
        this.state.baskets[iIndex].lit(bWin);
    };
    
    this.initBasketController(oParentContainer);
}

export default CScoreBasketController;


