import createjs from './createjs.js'
import settings from './settings.js'
import CSpriteLibrary from './sprite_lib.js'
import CBasket from './CBasket.js'

function CScoreBasketController(oParentContainer) {
    this.state = {
        baskets: []
    }

    this.initBasketController = function(oParentContainer) {
        const basketContainer = new createjs.Container();
        basketContainer.x = settings.get10PercentWidth();
        basketContainer.y = settings.get80PercentHeight();
        oParentContainer.addChild(basketContainer);
        
        const basketSprite = CSpriteLibrary.getImage('basket_display');
        const iWidth = basketSprite.width / 4;
        const iHeight = basketSprite.height;

        const spriteSheet = new createjs.SpriteSheet({
            images: [basketSprite], 
            // width, height & registration point of each sprite
            frames: {
                width: iWidth,
                height: iHeight,
                regX: iWidth / 2,
                regY: iHeight / 2
            }, 
            animations: {
                state_off: [0],
                state_green: [1],
                state_yellow: [2],
                state_red: [3]
            }
        });
        const gap = settings.getCellGapSize()
        // const basketWidth = gap / 2
        
        for (let i = 0; i < settings.getPrize().length; i += 1) {
            // this.state.baskets.push(new CBasket(100 + i * 30, 0, container, spriteSheet, iWidth, iHeight, settings.getPrize()[i].background));
            this.state.baskets.push(
                new CBasket(settings.get10PercentWidth() + (i * gap),
                0,
                basketContainer,
                spriteSheet,
                iWidth,
                iHeight,
                settings.getPrize()[i].background));
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


