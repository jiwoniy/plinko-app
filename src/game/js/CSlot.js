import $ from 'jquery'
import createjs from './createjs.js'

import {
    playSound,
 } from './ctl_utils.js'
 import settings from './settings.js'

function CSlot(iXPos,iYPos, iWidth, iHeight, oParentContainer) {
    
    var _bDisabled;
    
    var _iScaleFactor;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    
    var _oButton;
    var _oClickArea;
    // var _oTween;
    var _oParent;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oListenerMouseOver;
    
    this._init =function(iXPos,iYPos, oParentContainer){
        _bDisabled = false;
        
        _iScaleFactor = 1;
        
        _aCbCompleted = [];
        _aCbOwner = [];
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.scaleX =   _oButton.scaleY = _iScaleFactor;
        oParentContainer.addChild(_oButton);

       
        _oClickArea = new createjs.Shape();
        _oClickArea.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(-iWidth/2, -iHeight/2, iWidth, iHeight);
        _oButton.addChild(_oClickArea);
        
        this._initListener();
    };
    
    this.unload = function(){
        if($.browser.mobile){
            _oButton.off("mousedown", _oListenerMouseDown);
            _oButton.off("pressup" , _oListenerMouseUp);
        } else {
            _oButton.off("mousedown", _oListenerMouseDown);
            _oButton.off("mouseover", _oListenerMouseOver);
            _oButton.off("pressup" , _oListenerMouseUp);
        }
        
        _oButton.parent.removeChild(_oButton);
        
        //oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setClickable = function(bVal){
        _bDisabled = !bVal;
    };
    
    this._initListener = function(){
        if($.browser.mobile){
            _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
            _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);
        } else {
            _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
            _oListenerMouseOver = _oButton.on("mouseover", this.buttonOver);
            _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);
        }   
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisabled){
            return;
        }
        _oButton.scaleX = _iScaleFactor;
        _oButton.scaleY = _iScaleFactor;

        if(_aCbCompleted[settings.ON_MOUSE_UP]){
            _aCbCompleted[settings.ON_MOUSE_UP].call(_aCbOwner[settings.ON_MOUSE_UP], _aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisabled){
            return;
        }
        _oButton.scaleX = _iScaleFactor * 0.9;
        _oButton.scaleY = _iScaleFactor * 0.9;

        playSound("click", 1, false);

       if(_aCbCompleted[settings.ON_MOUSE_DOWN]) {
           _aCbCompleted[settings.ON_MOUSE_DOWN].call(_aCbOwner[settings.ON_MOUSE_DOWN], _aParams);
       }
    };
    
    this.buttonOver = function(evt){
        if(!$.browser.mobile){
            if(_bDisabled){
                return;
            }
            evt.target.cursor = "pointer";
        }  
    };
    
    this.addText = function(szText){
        var oScoreText = new createjs.Text(szText," 50px "+ settings.PRIMARY_FONT, "#ffffff");
        oScoreText.textAlign = "center";
        oScoreText.textBaseline = "middle";
        oScoreText.lineWidth = 200;
        _oButton.addChild(oScoreText);
    };
    
    this.pulseAnimation = function () {
        createjs.Tween.get(_oButton).to({scaleX: _iScaleFactor*1.1, scaleY: _iScaleFactor*1.1}, 850, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 650, createjs.Ease.quadIn).call(function () {
            _oParent.pulseAnimation();
        });
        // _oTween = createjs.Tween.get(_oButton).to({scaleX: _iScaleFactor*1.1, scaleY: _iScaleFactor*1.1}, 850, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 650, createjs.Ease.quadIn).call(function () {
        //     _oParent.pulseAnimation();
        // });
    };

    this.trembleAnimation = function () {
        createjs.Tween.get(_oButton).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn).wait(750).call(function () {
            _oParent.trebleAnimation();
        });
        // _oTween = createjs.Tween.get(_oButton).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn).wait(750).call(function () {
        //     _oParent.trebleAnimation();
        // });
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
        
    this.getPos = function() {
        return {x: _oButton.x, y: _oButton.y};
    };
        
    _oParent = this;
    this._init(iXPos,iYPos, oParentContainer);
    
    // return this;
}

export default CSlot;