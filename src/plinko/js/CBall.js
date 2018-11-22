import createjs from './createjs.js'
import {
    createBitmap,
    playSound,
 } from './ctl_utils.js'
import CSpriteLibrary from './sprite_lib.js'
import {
    gameInstance
} from './CGame.js'
// import settings from './settings.js'

function CBall(oPos, oParentContainer) {
    var _iDiameter;
    // var _iStartAnimTime;

    var _oBall;
    var _oBallSprite;
    // var _oParent;
    
    this._init = function(oPos, oParentContainer) {
        _oBall = new createjs.Container();
        _oBall.x = oPos.x;
        _oBall.y = oPos.y;
        oParentContainer.addChild(_oBall);
        
        var oSprite = CSpriteLibrary.getSprite('ball');
        _oBallSprite = createBitmap(oSprite);
        _oBallSprite.regX = oSprite.width/2;
        _oBallSprite.regY = oSprite.height/2;
        _oBall.addChild(_oBallSprite);

        _iDiameter = oSprite.height;
    };
    
    this.unload = function() {
        _oBall.parent.removeChild(_oBall);
    };
   
    this.getPos = function() {
        return { x: _oBall.x, y: _oBall.y };
    };
    
    this.getSprite = function() {
        return _oBall;
    };
    
    this.resetPos = function() {
        _oBall.x = oPos.x;
        _oBall.y = oPos.y;
    };
    
    this.setPos = function(oPos) {
        _oBall.x = oPos.x;
        _oBall.y = oPos.y;
    };
    
    this.setPosToPivot = function() {
        _oBall.regY = _iDiameter/2;
    };
    
    this.launchAnim = function(oPos) {
        var iTime = 1000;
        
        createjs.Tween.get(_oBall).to({ x: oPos.x }, iTime, createjs.Ease.sineOut);
        createjs.Tween.get(_oBall).to({ y: oPos.y - 400 }, iTime / 2, createjs.Ease.cubicOut).to({ y: oPos.y }, iTime / 2, createjs.Ease.cubicIn).call(() => {
            gameInstance().getFallPath();
        });
    };
    
    this.startPathAnim = (aPath, iStartTime) => {
        // _iStartAnimTime = iStartTime;
        this._jumpBall(aPath, iStartTime);
    };
    
    this._jumpBall = (aPath, iTime) => {
        playSound('ball_collision', 1, false);
        
        var aCurCell = aPath.splice(0,1);
        
        if(aPath.length === 1) {
            this._lastJumpBallAnim(aPath, iTime);
            return;
        }
        
        var oCurPos = gameInstance().getBallPivotCellPos(aCurCell[0].row, aCurCell[0].col);
        var oNextPos = gameInstance().getBallPivotCellPos(aPath[0].row, aPath[0].col);
        
        createjs.Tween
            .get(_oBall)
            .to({x:oNextPos.x}, iTime/*, createjs.Ease.cubicOut*/)
        createjs.Tween
            .get(_oBall)
            .to({y:oCurPos.y-10}, iTime/4, createjs.Ease.cubicOut)
            .to({y:oNextPos.y}, iTime*3/4, createjs.Ease.cubicIn)
            .call(() => {
            this._jumpBall(aPath, iTime);
        });

    };
    
    // this._fallBall = function(aPath, iTime) {
    //     aPath.splice(0,1);
        
    //     if(aPath.length === 1){
    //         _oParent._lastFallBallAnim(aPath, iTime);
    //         return;
    //     }

    //     var oParams = this._getFallParams(aPath, iTime);
        
        
    //     createjs.Tween.get(_oBallSprite).to({rotation:oParams.rotation}, iTime, createjs.Ease.sineIn);
    //     createjs.Tween.get(_oBall, {override:true}).to({x:oParams.posx}, iTime, createjs.Ease.sineIn);
    //     createjs.Tween.get(_oBall).to({y:oParams.posy}, iTime, createjs.Ease.cubicIn).call(function(){
    //             _oParent._fallBall(aPath, oParams.newtime);
                
    //     });
    // };

    this.releaseBallAnim = (iCol) => {
        const pEndPos = gameInstance().getBoard()[0][iCol].getCenterOfBallOnPivot();
        createjs.Tween
            .get(_oBall)
            .to({y:pEndPos.y}, 500, createjs.Ease.sineIn)
            .call(() => {
                gameInstance().launchBall(iCol)
            });
    };
    
    this._lastFallBallAnim = (aPath, iTime) => {
        var oParams = this._getFallParams(aPath, iTime);
        
        var iFloor = oParams.posy + 170;
        
        createjs.Tween
            .get(_oBallSprite)
            .to({rotation:oParams.rotation}, iTime, createjs.Ease.sineIn);
        createjs.Tween
            .get(_oBall, {override:true})
            .to({x:oParams.posx}, iTime, createjs.Ease.sineIn);
        createjs.Tween
            .get(_oBall).to({y:iFloor}, iTime, createjs.Ease.cubicIn)
            .call(() => {
                createjs.Tween
                    .get(_oBall)
                    .to({y:iFloor - 100}, iTime/2, createjs.Ease.cubicOut)
                    .to({y:iFloor}, iTime, createjs.Ease.bounceOut);
                gameInstance().ballArrived(aPath[0].col);
            });
    };
    
    this._lastJumpBallAnim = (aPath, iTime) => {
        var oNextPos = gameInstance().getBallPivotCellPos(aPath[0].row, aPath[0].col);
        var iFloor = oNextPos.y + 192;
        
        createjs.Tween
            .get(_oBall, {override:true})
            .to({x:oNextPos.x}, iTime, createjs.Ease.sineIn);
    
        createjs.Tween
            .get(_oBall)
            .to({y:_oBall.y-10}, iTime/4, createjs.Ease.cubicOut)
            .to({y:iFloor}, iTime*3/4, createjs.Ease.cubicIn)
            .call(() => {
                gameInstance().ballArrived(aPath[0].col);
                createjs.Tween
                    .get(_oBall)
                    .to({y:iFloor - 100}, iTime/2, createjs.Ease.cubicOut)
                    .to({y:iFloor}, iTime, createjs.Ease.bounceOut)
                    .call(() => {
                        createjs.Tween
                            .get(_oBall)
                            .to({alpha:0}, 3000, createjs.Ease.cubicIn)
                            .call(() => {
                                this.unload();
                            });
                    });
                
            });
    };
    
    // _oParent = this;
    this._init(oPos, oParentContainer);
}

export default CBall;


