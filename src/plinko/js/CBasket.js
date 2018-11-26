import createjs from './createjs.js'
import {
    // createBitmap,
    createSprite,
 } from './ctl_utils.js'
//  import CSpriteLibrary from './sprite_lib.js'
 import settings from './settings.js'

function CBasket(xPosition, yPosition, parentContainer, oSpriteSheet, iWidth, iHeight, prizeSprite) {
    // var _iStartSize;
    // var _oParent;
    // var _oText;
    // var _oBasket;
    // var _oHighlight;

    this.basketContainer = null
    this.hightLightBasket = null
    this.basketText = null
    
    this.initBasket = function(xPosition, yPosition, parentContainer, oSpriteSheet, iWidth, iHeight, prizeImage) {
        this.basketContainer = new createjs.Container();
        // this.basketContainer.y = yPosition;
        this.basketContainer.x = xPosition;
        parentContainer.addChild(this.basketContainer);
        
        const basketSprite = createSprite(
            oSpriteSheet,
            "state_off")
            // iWidth / 3,
            // iHeight / 3,
            // iWidth,
            // iHeight);
        // basketSprite.x = xPosition
        // basketSprite.x = xPosition / 2
        this.basketContainer.addChild(basketSprite);

        // const iFrameOffset = 3;
        // if (prizeImage) {
        //     const prizeSprite = CSpriteLibrary.getImage(prizeImage);
        //     const bitMapPrize = createBitmap(prizeSprite);
        //     bitMapPrize.regX = prizeSprite.width / 2;
        //     bitMapPrize.regY = prizeSprite.height / 2;
        //     // bitMapPrize.cache(prizeSprite.width / 2 - iWidth / 2 + iFrameOffset, prizeSprite.height / 2 - iHeight / 2 + iFrameOffset, iWidth - iFrameOffset * 2, iHeight - (iFrameOffset * 2));
        //     this.basketContainer.addChild(bitMapPrize);

        //     // add text
        //     // var oScoreText = new createjs.Text('test'," 20px "+ settings.PRIMARY_FONT, "#ffffff");
        //     // oScoreText.textAlign = "center";
        //     // oScoreText.textBaseline = "middle";
        //     // oScoreText.lineWidth = 200;
        //     // this.basketContainer.addChild(oScoreText);
        // }
        
        this.hightLightBasket = createSprite(oSpriteSheet, "state_on", iWidth / 2, iHeight / 2, iWidth, iHeight);
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
    this.initBasket(xPosition, yPosition, parentContainer, oSpriteSheet, iWidth, iHeight, prizeSprite);
}

export default CBasket;

