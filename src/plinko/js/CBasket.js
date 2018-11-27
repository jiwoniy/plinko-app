import createjs from './createjs.js'
import {
    // createBitmap,
    createSprite,
 } from './ctl_utils.js'
//  import CSpriteLibrary from './sprite_lib.js'
 import settings from './settings.js'

function CBasket(xPosition, yPosition, parentContainer, images, iWidth, iHeight, prizeSprite) {
    this.basketContainer = null
    this.hightLightBasket = null
    this.basketText = null
    
    this.initBasket = function(xPosition, yPosition, parentContainer, images, width, height, prizeImage) {
        this.basketContainer = new createjs.Container();
        this.basketContainer.y = yPosition;
        this.basketContainer.x = xPosition;
        parentContainer.addChild(this.basketContainer);

        const spriteSheet = new createjs.SpriteSheet({
            images: [ ...images ], 
            // width, height & registration point of each sprite
            frames: [
                [0 , 0, images[0].width, images[0].height, 0, 0, 0],
                [0 , 0, images[0].width, images[0].height, 1, - (width / 2), 0],
                [0 , 0, images[0].width, images[0].height, 2, - (width / 2), 0],
                [0 , 0, images[0].width, images[0].height, 3, - (width / 2), 0],
            ],
            animations: {
                state_off: [0],
                state_green: [1],
                state_yellow: [2],
                state_red: [3]
            }
        });
        
        const basketSprite = createSprite(
            spriteSheet,
            "state_off")
        basketSprite.regX = - (width / 2)
        this.basketContainer.addChild(basketSprite);
        
        this.hightLightBasket = createSprite(spriteSheet, "state_on", width / 2, height / 2, width, height);
        this.hightLightBasket.alpha = 0;
        this.basketContainer.addChild(this.hightLightBasket);
    };
    
    this.unload = () => {
        parentContainer.removeChild(this.basketContainer);
    };
    
    // this._setText = function(iSize) {
    //     var iNewSize = iSize;
        
    //     while (this.basketText.getBounds().height > (iHeight - iSize)) {
    //         iNewSize -= 1;
    //         // _oText.font = " "+iNewSize+"px "+ settings.PRIMARY_FONT;
    //         this.basketText.font = ` ${iNewSize}px${settings.PRIMARY_FONT}`;

    //     };
    //     const iOffset = 10;
    //     this.basketText.y = -(this.basketText.getBounds().height / 2) + iOffset;
    // };
    
    // this._verticalizeText = function(szText) {
    //     let szNewText = "";
    //     for (let i = 0; i < szText.length; i += 1) {
    //         if (i !== szText.length - 1) {
    //             szNewText += szText[i]+"\n";
    //         } else {
    //             szNewText += szText[i];
    //         }
    //     };

    //     return szNewText;
    // };
    
    this.lit = (bWin) => {
        if (bWin) {
            this.hightLightBasket.gotoAndPlay("state_green");
        } else {
            this.hightLightBasket.gotoAndPlay("state_red");
        }
       
        // _oParent._recursiveLit(settings.BASKET_LIT_ITERATION);
        this.recursiveLit(settings.BASKET_LIT_ITERATION);
    };
    
    this.recursiveLit = (iLitIteration) => {
        iLitIteration -= 1;
        if (iLitIteration < 0) {
            return;
        }
        createjs.Tween
            .get(this.hightLightBasket)
            .to({ alpha: 1 }, 100)
            .to({ alpha: 0 }, 100)
            .call(() => {
                this.recursiveLit(iLitIteration);
            });
    };
    
    // _oParent = this;
    this.initBasket(xPosition, yPosition, parentContainer, images, iWidth, iHeight, prizeSprite);
}

export default CBasket;

