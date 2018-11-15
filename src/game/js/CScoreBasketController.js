function CScoreBasketController(oParentContainer){
    
    var _aBasket;
    
    this._init = function(oParentContainer){
        
        var oScoreContainer = new createjs.Container();
        oScoreContainer.y = 1472;
        oParentContainer.addChild(oScoreContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('basket_display');
        var iWidth = oSprite.width/4;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {state_off:[0],state_green:[1], state_yellow:[2], state_red:[3]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _aBasket = new Array();
        
        for(var i=0; i<PRIZE.length; i++){
            _aBasket.push(new CBasket(290 +i*140, 0, oScoreContainer, oSpriteSheet, iWidth, iHeight, PRIZE[i].background));
        };
        
    };
    
    this.unload = function(){
        for(var i=0; i<PRIZE.length; i++){
            _aBasket[i].unload();
        };
    };
    
    this.litBasket = function(iIndex, bWin){
        
        _aBasket[iIndex].lit(bWin);
    };
    
    this._init(oParentContainer);
}


