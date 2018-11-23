import createjs from './createjs.js'
import settings from './settings.js'
import CSpriteLibrary from './sprite_lib.js'
import CBasket from './CBasket.js'

function CScoreBasketController(parentContainer) {
    this.state = {
        baskets: []
    }

    this.initBasketController = function(parentContainer) {
        const basketContainer = new createjs.Container();
        // basketContainer.x = settings.get10PercentWidth();
        // basketContainer.setBounds(settings.get10PercentWidth() , settings.get80PercentHeight(), settings.get80PercentWidth(), 50)
        basketContainer.x = settings.get10PercentWidth();
        basketContainer.y = settings.get80PercentHeight();
        
        // console.log(settings.get10PercentWidth())
        // console.log(basketContainer.getBounds())
        // console.log(basketContainer.x)
        
        parentContainer.addChild(basketContainer);
        
        const basketSprite = CSpriteLibrary.getImage('basket_display');
        const iWidth = basketSprite.width / 4;
        const iHeight = basketSprite.height;

        
        const spriteSheet = new createjs.SpriteSheet({
            images: [ basketSprite ], 
            // width, height & registration point of each sprite
            frames: {
                width: iWidth,
                height: iHeight,
                // regX: iWidth / 2,
                // regY: iHeight / 2
                // regX: iWidth / 2,
                // regY: iHeight / 2
            }, 
            animations: {
                state_off: [0],
                state_green: [1],
                state_yellow: [2],
                state_red: [3]
            }
        });
        const gap = settings.getCellGapSize()
        // const gap = 50
        // const gap = 50
        const basketWidth = gap

        for (let i = 0; i < settings.getPrize().length; i += 1) {
            this.state.baskets.push(
                new CBasket(i * gap,
                0,
                basketContainer,
                spriteSheet,
                basketWidth,
                iHeight,
                // settings.getPrize()[i].background));
                null)
            );
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
    
    this.initBasketController(parentContainer);
}

export default CScoreBasketController;


