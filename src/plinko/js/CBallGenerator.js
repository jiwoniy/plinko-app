import createjs from './createjs.js'
import settings from './settings.js'
// import {
//     createBitmap,
//  } from './ctl_utils.js'
import CBall from './CBall.js'
// import CSpriteLibrary from './sprite_lib.js'


function CBallGenerator(oParentContainer) {
    var _iBallInTube;
    var _iBallInAnimation;
    var _iOffsetFromBall;
    
    // var _aBall;
    // var _oParent;
    var _oGeneratorContainer;
    var _oFrontContainer;
    
    var _pStartPoint;

    this.state = {
        ball: []
    }
    
    this._init = (oParentContainer) => {
        _oGeneratorContainer = new createjs.Container();
        oParentContainer.addChild(_oGeneratorContainer);
        
        _oFrontContainer = new createjs.Container();
        oParentContainer.addChild(_oFrontContainer)
        
        _iBallInTube = 3;
        _iOffsetFromBall = (settings.getBallRadius() * 2) - 20;
        _pStartPoint = {x: 182, y: 264};
        // this.state.ball = [];
        for(let i = 0; i < _iBallInTube; i += 1) {
            const oBallPos = {x: _pStartPoint.x - i*_iOffsetFromBall, y: _pStartPoint.y};
            this.state.ball[i] = new CBall(oBallPos, _oGeneratorContainer);
        }
        
        // const ballGeneratorSprite = CSpriteLibrary.getSprite('ball_generator');
        // const generator = createBitmap(ballGeneratorSprite);
        // generator.x = 0;
        // generator.y = 196;
        // _oFrontContainer.addChild(generator);
    };
    
    this.unload = () => {
        oParentContainer.removeChild(_oGeneratorContainer);
        oParentContainer.removeChild(_oFrontContainer);
    };
    
    this.shiftBallAnimation = () => {
        this.state.ball.splice(0, 1);
        
        var iLastIndex = _iBallInTube - 1;
        
        const ballPosition = { x: _pStartPoint.x - (iLastIndex * _iOffsetFromBall), y: _pStartPoint.y };
        this.state.ball[iLastIndex] = new CBall(ballPosition, _oGeneratorContainer);
        
        _iBallInAnimation = 2;
        for(let i = 0; i < _iBallInAnimation; i += 1) {
            const innerBallPosition = { x: _pStartPoint.x - (i * _iOffsetFromBall), y: _pStartPoint.y};
            createjs.Tween.get(this.state.ball[i].getSprite(), { override: true }).wait(i*200).to({ x: innerBallPosition.x }, 1000, createjs.Ease.cubicIn);
        }
    };
    
    this.getNextBall = () => {
        return this.state.ball[0];
    };
    
    // _oParent = this;
    this._init(oParentContainer);
}

export default CBallGenerator;


