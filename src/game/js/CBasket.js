function CBasket(iX, iY, oParentContainer, oSpriteSheet, iWidth, iHeight, oPrizeSprite){
    var _iStartSize;
    
    var _oParent;
    var _oText;
    var _oBasket;
    var _oHighlight;
    
    this._init = function(iX, iY, oParentContainer, oSpriteSheet, iWidth, iHeight, oPrizeSprite){
        _oBasket = new createjs.Container();
        _oBasket.y = iY;
        _oBasket.x = iX;
        oParentContainer.addChild(_oBasket);
        
        var oBasketSprite = createSprite(oSpriteSheet, "state_off",iWidth/2, iHeight/2, iWidth, iHeight);
        _oBasket.addChild(oBasketSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite(oPrizeSprite);
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        var iFrameOffset = 3;
        oBg.cache(oSprite.width/2 - iWidth/2 + iFrameOffset, oSprite.height/2 - iHeight/2 +iFrameOffset, iWidth - iFrameOffset*2, iHeight -iFrameOffset*2);
        _oBasket.addChild(oBg);
        
        _oHighlight = createSprite(oSpriteSheet, "state_on",iWidth/2, iHeight/2, iWidth, iHeight);
        _oHighlight.alpha = 0;
        _oBasket.addChild(_oHighlight);

    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oBasket);
    };
    
    this._setText = function(iSize){      

        var iNewSize = iSize;
        
        while(_oText.getBounds().height>iHeight-iSize){
            iNewSize--;
            _oText.font = " "+iNewSize+"px "+PRIMARY_FONT;

        };
        var iOffset = 10;
        
        _oText.y = -_oText.getBounds().height/2+iOffset;
    };
    
    this._verticalizeText = function(szText){
        var szNewText = "";
        for(var i=0; i<szText.length; i++){
            if(i !== szText.length-1){
                szNewText += szText[i]+"\n";
            } else {
                szNewText += szText[i];
            }
        };

        return szNewText;
    };
    
    this.lit = function(bWin){
        
        if(bWin){
            _oHighlight.gotoAndPlay("state_green");
        }else {
            _oHighlight.gotoAndPlay("state_red");
        }
       
        _oParent._recursiveLit(BASKET_LIT_ITERATION);
    };
    
    this._recursiveLit = function(iLitIteration){
        iLitIteration--;
        if(iLitIteration<0){
            return;
        }

        createjs.Tween.get(_oHighlight).to({alpha:1}, 100).to({alpha:0}, 100).call(function(){
            _oParent._recursiveLit(iLitIteration);
        });
    };
    
    _oParent = this;
    this._init(iX, iY, oParentContainer, oSpriteSheet, iWidth, iHeight, oPrizeSprite);
    
}


