import $ from 'jquery'
import createjs from './createjs.js'

import {
    playSound,
 } from './ctl_utils.js'
 import settings from './settings.js'

function CSlot(iXPos,iYPos, iWidth, iHeight, parentContainer) {
    // var _bDisabled;
        
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    
    // var _oButton;
    // var _oClickArea;
    // var _oTween;
    // var _oParent;
    // var _oListenerMouseDown;
    // var _oListenerMouseUp;
    // var _oListenerMouseOver;

    this.parentContainer = null
    this.buttonContainer = null
    this.clickContainer = null
    this.listener = {
        mouseDown: null,
        mouseUp: null,
        mouseOver: null
    }
    this.state = {
        disable: false,
        scaleFactor: 1
    }
    
    this.initSlot = function(iXPos ,iYPos, parentContainer) {                
        _aCbCompleted = [];
        _aCbOwner = [];
        
        this.parentContainer = parentContainer
        this.buttonContainer = new createjs.Container();
        this.buttonContainer.x = iXPos;
        this.buttonContainer.y = iYPos; 
        this.buttonContainer.scaleX = this.state.scaleFactor; 
        this.buttonContainer.scaleY = this.state.scaleFactor;
        parentContainer.addChild(this.buttonContainer);

       
        this.clickContainer = new createjs.Shape();
        this.clickContainer.graphics
            .beginFill("rgba(255,255,255,0.01)")
            .drawRect(-iWidth / 2, -iHeight / 2, iWidth, iHeight);
            this.buttonContainer.addChild(this.clickContainer);
        
        this.initListener();
    };
    
    this.unload = () => {
        if ($.browser.mobile) {
            this.buttonContainer.off("mousedown", this.listener.mouseDown);
            this.buttonContainer.off("pressup" , this.listener.mouseUp);
        } else {
            this.buttonContainer.off("mousedown", this.listener.mouseDown);
            this.buttonContainer.off("mouseover", this.listener.mouseOver);
            this.buttonContainer.off("pressup" , this.listener.mouseUp);
        }
        
        this.buttonContainer.parent.removeChild(this.buttonContainer);
        
        //oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = (bVisible) => {
        this.buttonContainer.visible = bVisible;
    };
    
    this.setClickable = (value) => {
        this.state.disable = !value;
    };
    
    this.initListener = () => {
        if ($.browser.mobile) {

            this.listener = {
                mouseDown: null,
                mouseUp: null,
                mouseOver: null
            }
            this.listener.mouseDown = this.buttonContainer.on("mousedown", this.buttonDown);
            this.listener.mouseUp = this.buttonContainer.on("pressup", this.buttonRelease);
        } else {
            this.listener.mouseDown = this.buttonContainer.on("mousedown", this.buttonDown);
            this.listener.mouseOver = this.buttonContainer.on("mouseover", this.buttonOver);
            this.listener.mouseUp = this.buttonContainer.on("pressup", this.buttonRelease);
        }   
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = (iEvent, cbCompleted, cbOwner, aParams) => {
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = () => {
        if (!this.state.disable) {
            this.buttonContainer.scaleX = this.state.scaleFactor;
            this.buttonContainer.scaleY = this.state.scaleFactor;

        if (_aCbCompleted[settings.ON_MOUSE_UP]) {
                _aCbCompleted[settings.ON_MOUSE_UP].call(_aCbOwner[settings.ON_MOUSE_UP], _aParams);
            }   
        }
    };
    
    this.buttonDown = () => {
        if (!this.state.disable) {
            this.buttonContainer.scaleX = this.state.scaleFactor * 0.9;
            this.buttonContainer.scaleY = this.state.scaleFactor * 0.9;

            playSound("click", 1, false);

            if (_aCbCompleted[settings.ON_MOUSE_DOWN]) {
                _aCbCompleted[settings.ON_MOUSE_DOWN].call(_aCbOwner[settings.ON_MOUSE_DOWN], _aParams);
            }
        }
    };
    
    this.buttonOver = (evt) => {
        if (!$.browser.mobile) {
            if (!this.state.disable) {
                evt.target.cursor = "pointer";
            }
        }  
    };
    
    this.addText = function(szText){
        var oScoreText = new createjs.Text(szText," 50px "+ settings.PRIMARY_FONT, "#ffffff");
        oScoreText.textAlign = "center";
        oScoreText.textBaseline = "middle";
        oScoreText.lineWidth = 200;
        this.buttonContainer.addChild(oScoreText);
    };
    
    this.pulseAnimation =  () => {
        createjs.Tween
            .get(this.buttonContainer)
            .to({scaleX: this.state.scaleFactor * 1.1, scaleY: this.state.scaleFactor * 1.1}, 850, createjs.Ease.quadOut)
            .to({scaleX: this.state.scaleFactor, scaleY: this.state.scaleFactor }, 650, createjs.Ease.quadIn)
            .call(() => {
            this.parentContainer.pulseAnimation();
        });
        // _oTween = createjs.Tween.get(_oButton).to({scaleX: _iScaleFactor*1.1, scaleY: _iScaleFactor*1.1}, 850, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 650, createjs.Ease.quadIn).call(function () {
        //     _oParent.pulseAnimation();
        // });
    };

    this.trembleAnimation = () => {
        createjs.Tween
            .get(this.buttonContainer)
            .to({rotation: 5}, 75, createjs.Ease.quadOut)
            .to({rotation: -5}, 140, createjs.Ease.quadIn)
            .to({rotation: 0}, 75, createjs.Ease.quadIn)
            .wait(750)
            .call(() => {
            this.parentContainer.trebleAnimation();
        });
        // _oTween = createjs.Tween.get(_oButton).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn).wait(750).call(function () {
        //     _oParent.trebleAnimation();
        // });
    };
    
    this.setPosition = (iXPos,iYPos) => {
        this.buttonContainer.x = iXPos;
        this.buttonContainer.y = iYPos;
    };
    
    this.setX = (iXPos) => {
        this.buttonContainer.x = iXPos;
    };
    
    this.setY = (iYPos) => {
        this.buttonContainer.y = iYPos;
    };
    
    this.getButtonImage = () => {
        return this.buttonContainer;
    };

    this.getX = () => {
        return this.buttonContainer.x;
    };
    
    this.getY = () => {
        return this.buttonContainer.y;
    };
        
    this.getPos = () => {
        return {x: this.buttonContainer.x, y: this.buttonContainer.y};
    };
        
    // _oParent = this;
    this.initSlot(iXPos,iYPos, parentContainer);
}

export default CSlot;