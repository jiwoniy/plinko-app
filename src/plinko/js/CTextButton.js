import $ from 'jquery'
import createjs from './createjs.js'

import {
    createBitmap,
    createSprite,
    playSound
} from './ctl_utils.js'
import settings from './settings.js'

function CTextButton(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, bStandard, oParentContainer) {
    var _bDisable;
    
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oListenerMouseOver;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oText;
    var _oTextBack;
    var _oButtonBg;
    
    this._init = function(iXPos, iYPos, pSprite, szText, szFont, szColor, iFontSize, bStandard, oParentContainer) {
        _bDisable = false;
        
        _aCbCompleted = [];
        _aCbOwner = [];
        _oButtonBg = createBitmap(pSprite);           

        var iStepShadow = Math.ceil(iFontSize / 20);

        _oTextBack = new createjs.Text(szText,"bold "+iFontSize+"px "+szFont, "#000000");
        _oTextBack.textAlign = 'center';
        _oTextBack.textBaseline = 'alphabetic';
        const textBackBounds = _oTextBack.getBounds();    
        _oTextBack.x = pSprite.width / 2 + iStepShadow;
        _oTextBack.y = Math.floor(pSprite.height/2) +(textBackBounds.height / 3) + iStepShadow - 7;

        _oText = new createjs.Text(szText,"bold "+iFontSize+"px "+szFont, szColor);
        _oText.textAlign = 'center';
        _oText.textBaseline = 'alphabetic';
        const textBounds = _oText.getBounds();    
        _oText.x = pSprite.width/2;
        _oText.y = Math.floor(pSprite.height / 2) +(textBounds.height / 3) -7;

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = pSprite.width / 2;
        _oButton.regY = pSprite.height / 2; 
        _oButton.cursor = 'pointer';

        if(!bStandard) {                   
            const spriteSheet = new createjs.SpriteSheet({   
                images: [pSprite], 
                // width, height & registration point of each sprite
                frames: {width: pSprite.width / 2, height: pSprite.height, regX:(pSprite.width / 2 ) /2, regY:pSprite.height / 2}, 
                animations: {
                    state_true:[0],
                    state_false:[1]
                }
           });         
            _oButtonBg = createSprite(spriteSheet, "state_false", (pSprite.width / 2) / 2, pSprite.height / 2, pSprite.width / 2, pSprite.height);
            
            var iOffset = 17;
            
            _oTextBack.x = iStepShadow;
            _oTextBack.y = iStepShadow + iOffset;
            _oText.x = 0;
            _oText.y = iOffset;
            _oButton.regX = 0;
            _oButton.regY = 0;
            
        }
        _oButton.addChild(_oButtonBg,_oTextBack,_oText);

        oParentContainer.addChild(_oButton);

        this._initListener();
    };
    
    this.unload = function() {
       if($.browser.mobile) {
            _oButton.off("mousedown", _oListenerMouseDown);
            _oButton.off("pressup" , _oListenerMouseUp);
        } else {
            _oButton.off("mousedown", _oListenerMouseDown);
            _oButton.off("mouseover", _oListenerMouseOver);
            _oButton.off("pressup" , _oListenerMouseUp);
        }
        
        oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible) {
        _oButton.visible = bVisible;
    };
    
    this.setClickable = function(bVal) {
        _bDisable = !bVal;
        
        if(!bVal) {
            _oButton.cursor = "arrow";
        }
    };
    
    this._initListener = function() {
       if($.browser.mobile) {
            _oListenerMouseDown   = _oButton.on("mousedown", this.buttonDown);
            _oListenerMouseUp     = _oButton.on("pressup" , this.buttonRelease);
        } else {
            _oListenerMouseDown   = _oButton.on("mousedown", this.buttonDown);
            _oListenerMouseOver   = _oButton.on("mouseover", this.buttonOver);
            _oListenerMouseUp     = _oButton.on("pressup" , this.buttonRelease);
        }      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner) {
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function() {
        if (_bDisable) {
            return;
        }
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[settings.ON_MOUSE_UP]) {
            _aCbCompleted[settings.ON_MOUSE_UP].call(_aCbOwner[settings.ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function() {
        if (_bDisable) {
            return;
        }
        
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

        playSound("click",1,false);

       if (_aCbCompleted[settings.ON_MOUSE_DOWN]) {
           _aCbCompleted[settings.ON_MOUSE_DOWN].call(_aCbOwner[settings.ON_MOUSE_DOWN]);
       }
    };
    
    this.buttonOver = function(evt) {
        if (!$.browser.mobile) {
            if (_bDisable) {
                return;
            }
            evt.target.cursor = "pointer";
        }  
    };
    
    this.enable = function() {
        _bDisable = false;
        
        if (!bStandard) {
            _oButtonBg.gotoAndStop("state_true");
        }
    };
    
    this.disable = function() {
        _bDisable = true;
        if (!bStandard) {
            _oButtonBg.gotoAndStop("state_false");
        }
    };
    
    this.fadeOut = function() {
        this.setClickable(false);
        createjs.Tween.get(_oButton).to({alpha:0}, 500);
    };
    
    this.fadeIn = function() {
        this.setClickable(true);
        createjs.Tween.get(_oButton).to({alpha:1}, 500);
    };
    
    this.hideShadow = function() {
        _oTextBack.visible = false;
    };
    
    this.setTextPosition = function(iX, iY) {
        var iStepShadow = Math.ceil(iFontSize/20);
        
        _oTextBack.x = iX + iStepShadow;
        _oTextBack.y = iY + iStepShadow;
        _oText.x = iX;
        _oText.y = iY;
        
    };
    
    this.setTextHeight = function(iY) {
        var iStepShadow = Math.ceil(iFontSize/20);
        _oTextBack.y = iY + iStepShadow;
        _oText.y = iY;
    };  
    
    this.setPosition = function(iXPos,iYPos) {
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos) {
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos) {
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function() {
        return _oButton;
    };

    this.getX = function() {
        return _oButton.x;
    };
    
    this.getY = function() {
        return _oButton.y;
    };

    this._init(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, bStandard, oParentContainer);    
}

export default CTextButton;
