import createjs from './createjs.js'
import {
    createBitmap,
    createSprite,
 } from './ctl_utils.js'
 import CSpriteLibrary from './sprite_lib.js'
 import settings from './settings.js'

function CBasket(iX, iY, oParentContainer, oSpriteSheet, iWidth, iHeight, prizeSprite) {
    // var _iStartSize;
    // var _oParent;
    var _oText;
    var _oBasket;
    var _oHighlight;
    
    this.initBasket = function(iX, iY, oParentContainer, oSpriteSheet, iWidth, iHeight, pPrizeSprite) {
        _oBasket = new createjs.Container();
        _oBasket.y = iY;
        _oBasket.x = iX;
        oParentContainer.addChild(_oBasket);
        
        var oBasketSprite = createSprite(oSpriteSheet, "state_off",iWidth/2, iHeight/2, iWidth, iHeight);
        _oBasket.addChild(oBasketSprite);
        
        const prizeSprite = CSpriteLibrary.getSprite(pPrizeSprite);
        const bitMapPrize = createBitmap(prizeSprite);
        bitMapPrize.regX = prizeSprite.width / 2;
        bitMapPrize.regY = prizeSprite.height / 2;
        var iFrameOffset = 3;
        bitMapPrize.cache(prizeSprite.width / 2 - iWidth / 2 + iFrameOffset, prizeSprite.height / 2 - iHeight / 2 + iFrameOffset, iWidth - iFrameOffset * 2, iHeight - (iFrameOffset * 2));
        _oBasket.addChild(bitMapPrize);
        
        _oHighlight = createSprite(oSpriteSheet, "state_on", iWidth/2, iHeight/2, iWidth, iHeight);
        _oHighlight.alpha = 0;
        _oBasket.addChild(_oHighlight);

    };
    
    this.unload = () => {
        oParentContainer.removeChild(_oBasket);
    };
    
    this._setText = function(iSize) {
        var iNewSize = iSize;
        
        while(_oText.getBounds().height>iHeight-iSize) {
            iNewSize--;
            // _oText.font = " "+iNewSize+"px "+ settings.PRIMARY_FONT;
            _oText.font = ` ${iNewSize}px${settings.PRIMARY_FONT}`;

        };
        const iOffset = 10;
        _oText.y = -(_oText.getBounds().height / 2) + iOffset;
    };
    
    this._verticalizeText = function(szText) {
        let szNewText = "";
        for(var i=0; i<szText.length; i++){
            if(i !== szText.length-1){
                szNewText += szText[i]+"\n";
            } else {
                szNewText += szText[i];
            }
        };

        return szNewText;
    };
    
    this.lit = (bWin) => {
        if (bWin) {
            _oHighlight.gotoAndPlay("state_green");
        } else {
            _oHighlight.gotoAndPlay("state_red");
        }
       
        // _oParent._recursiveLit(settings.BASKET_LIT_ITERATION);
        this._recursiveLit(settings.BASKET_LIT_ITERATION);
    };
    
    this._recursiveLit = (iLitIteration) => {
        iLitIteration--;
        if (iLitIteration < 0) {
            return;
        }
        createjs.Tween.get(_oHighlight).to({alpha:1}, 100).to({alpha:0}, 100).call(() => {
            this._recursiveLit(iLitIteration);
        });
    };
    
    // _oParent = this;
    this.initBasket(iX, iY, oParentContainer, oSpriteSheet, iWidth, iHeight, prizeSprite);
}

export default CBasket;

