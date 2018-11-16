import createjs from './createjs.js'
import settings from './settings.js'
import {
    createBitmap,
 } from './ctl_utils.js'
import CBall from './CBall.js'
import CSpriteLibrary from './sprite_lib.js'


function CBallGenerator(oParentContainer) {
    var _iBallInTube;
    var _iBallInAnimation;
    var _iOffsetFromBall;
    
    var _aBall;
    
    // var _oParent;
    var _oGeneratorContainer;
    var _oFrontContainer;
    
    var _pStartPoint;
    
    this._init = (oParentContainer) => {
        
        _oGeneratorContainer = new createjs.Container();
        oParentContainer.addChild(_oGeneratorContainer);
        
        _oFrontContainer = new createjs.Container();
        oParentContainer.addChild(_oFrontContainer)
        
        _iBallInTube = 3;
        _iOffsetFromBall = (settings.BALL_RADIUS * 2) - 20;
        _pStartPoint = {x: 182, y: 264};
        _aBall = [];
        for(var i=0; i<_iBallInTube; i++){
            var oBallPos = {x: _pStartPoint.x - i*_iOffsetFromBall, y: _pStartPoint.y};
            _aBall[i] = new CBall(oBallPos, _oGeneratorContainer);
        }
        
        var oSprite = CSpriteLibrary.getSprite('ball_generator');
        var oGenerator = createBitmap(oSprite);
        oGenerator.x = 0;
        oGenerator.y = 196;
        _oFrontContainer.addChild(oGenerator);
        
    };
    
    this.unload = () => {
        oParentContainer.removeChild(_oGeneratorContainer);
        oParentContainer.removeChild(_oFrontContainer);
    };
    
    this.shiftBallAnimation = () => {
        _aBall.splice(0,1);
        
        var iLastIndex = _iBallInTube - 1;
        
        const ballPosition = { x: _pStartPoint.x - (iLastIndex * _iOffsetFromBall), y: _pStartPoint.y };
        _aBall[iLastIndex] = new CBall(ballPosition, _oGeneratorContainer);
        
        _iBallInAnimation = 2;
        for(let i = 0; i < _iBallInAnimation; i += 1) {
            const innerBallPosition = { x: _pStartPoint.x - (i * _iOffsetFromBall), y: _pStartPoint.y};
            createjs.Tween.get(_aBall[i].getSprite(), { override: true }).wait(i*200).to({ x: innerBallPosition.x }, 1000, createjs.Ease.cubicIn);
        }
    };
    
    this.getNextBall = () => {
        return _aBall[0];
    };
    
    // _oParent = this;
    this._init(oParentContainer);
}

export default CBallGenerator;


