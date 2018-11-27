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
        basketContainer.y = settings.getGame80Height();

        parentContainer.addChild(basketContainer);
        
        // const basketSprite = CSpriteLibrary.getImage('basket_display');
        const basketSprite = CSpriteLibrary.getImage('racket_purple');
        const height = basketSprite.height;
        const images = [ basketSprite, basketSprite, basketSprite, basketSprite ];

        const gap = settings.getCellGapSize() // TOD        
        const basketWidth = gap

        for (let i = 0; i < settings.getPrize().length; i += 1) {
            this.state.baskets.push(
                new CBasket((gap / 2) + (i * gap),
                0,
                basketContainer,
                images,
                // spriteSheet,
                basketWidth,
                height,
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


