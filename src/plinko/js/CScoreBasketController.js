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
        basketContainer.y = settings.getBasketHeightPosition();

        parentContainer.addChild(basketContainer);
        
        // const basketSprite = CSpriteLibrary.getImage('basket_display');
        const racket_purple = CSpriteLibrary.getImage('racket_purple');
        const racket_green = CSpriteLibrary.getImage('racket_green');
        const racket_yellow = CSpriteLibrary.getImage('racket_yellow');
        const height = racket_purple.height;
        const images = [ racket_purple, racket_green, racket_yellow, racket_yellow ];

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


