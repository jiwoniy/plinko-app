import createjs from './createjs.js'
import {
    createBitmap,
    playSound,
 } from './ctl_utils.js'
import CSpriteLibrary from './sprite_lib.js'
import {
    gameInstance
} from './CGame.js'
import settings from './settings.js'

function CBall(ballPosition, oParentContainer) {
    this.container = null
    this.state = {
        ballSpriteHeight: 0,
        ballSpriteBitmap: null
    }
    
    this.initBall = function(ballPosition, oParentContainer) {
        this.container = new createjs.Container();
        this.container.x = ballPosition.x;
        this.container.y = ballPosition.y;

        oParentContainer.addChild(this.container);
        
        const ballSprite = CSpriteLibrary.getImage('ball');
        const ballWidth = settings.getDeviceWidthRatio(ballSprite.width)
        this.state.ballSpriteBitmap = createBitmap(ballSprite);

        this.state.ballSpriteBitmap.regX = ballWidth / 2;
        this.state.ballSpriteBitmap.regY = ballWidth / 2;
        this.container.addChild(this.state.ballSpriteBitmap);

        this.ballSpriteBitmap = settings.getDeviceHeightRatio(ballSprite.height)
    };
    
    this.unload = () => {
        this.container.parent.removeChild(this.container);
    };
   
    this.getPos = () => {
        return { x: this.container.x, y: this.container.y };
    };
    
    this.getImage = () => {
        return this.container;
    };
    
    this.resetPos = () => {
        this.container.x = ballPosition.x;
        this.container.y = ballPosition.y;
    };
    
    this.setPos = (oPos) => {
        this.container.x = oPos.x;
        this.container.y = oPos.y;
    };
    
    // this.setPosToPivot = () => {
    //     this.container.regY = this.ballSpriteBitmap / 2;
    // };
    
    this.launchAnim = (oPos) => {
        const iTime = 1000;
        
        createjs.Tween
            .get(this.container)
            .to({ x: oPos.x }, iTime, createjs.Ease.sineOut);
        createjs.Tween
            .get(this.container)
            .to({ y: oPos.y - 300 }, iTime / 2, createjs.Ease.cubicOut)
            .to({ y: oPos.y }, iTime / 2, createjs.Ease.cubicIn).call(() => {
                gameInstance().getFallPath();
            });
    };
    
    this.startPathAnim = (aPath, iStartTime) => {
        // _iStartAnimTime = iStartTime;
        this.jumpBall(aPath, iStartTime);
    };
    
    this.jumpBall = (aPath, iTime) => {
        playSound('ball_collision', 1, false);
        
        var aCurCell = aPath.splice(0, 1);
        
        if(aPath.length === 1) {
            this.lastJumpBallAnim(aPath, iTime);
            return;
        }
        
        var oCurPos = gameInstance().getBallPivotCellPos(aCurCell[0].row, aCurCell[0].col);
        var oNextPos = gameInstance().getBallPivotCellPos(aPath[0].row, aPath[0].col);
        
        createjs.Tween
            .get(this.container)
            .to({x:oNextPos.x}, iTime/*, createjs.Ease.cubicOut*/)
        createjs.Tween
            .get(this.container)
            .to({ y: oCurPos.y - 10 }, iTime / 4, createjs.Ease.cubicOut)
            .to({ y: oNextPos.y }, iTime * 3 / 4, createjs.Ease.cubicIn)
            .call(() => {
            this.jumpBall(aPath, iTime);
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
            .get(this.container)
            .to({y:pEndPos.y}, 500, createjs.Ease.sineIn)
            .call(() => {
                gameInstance().launchBall(iCol)
            });
    };
    
    // this._lastFallBallAnim = (aPath, iTime) => {
    //     var oParams = this._getFallParams(aPath, iTime);
        
    //     var iFloor = oParams.posy + 170;
        
    //     createjs.Tween
    //         .get(this.state.ballSpriteBitmap)
    //         .to({rotation:oParams.rotation}, iTime, createjs.Ease.sineIn);
    //     createjs.Tween
    //         .get(this.container, {override:true})
    //         .to({x:oParams.posx}, iTime, createjs.Ease.sineIn);
    //     createjs.Tween
    //         .get(this.container).to({y:iFloor}, iTime, createjs.Ease.cubicIn)
    //         .call(() => {
    //             createjs.Tween
    //                 .get(this.container)
    //                 .to({y:iFloor - 100}, iTime/2, createjs.Ease.cubicOut)
    //                 .to({y:iFloor}, iTime, createjs.Ease.bounceOut);
    //             gameInstance().ballArrived(aPath[0].col);
    //         });
    // };
    
    this.lastJumpBallAnim = (aPath, iTime) => {
        var oNextPos = gameInstance().getBallPivotCellPos(aPath[0].row, aPath[0].col);
        var iFloor = oNextPos.y + 192;
        
        createjs.Tween
            .get(this.container, {override:true})
            .to({x:oNextPos.x}, iTime, createjs.Ease.sineIn);
    
        createjs.Tween
            .get(this.container)
            .to({y: this.container.y - 10}, iTime / 4, createjs.Ease.cubicOut)
            .to({y:iFloor}, iTime*3/4, createjs.Ease.cubicIn)
            .call(() => {
                gameInstance().ballArrived(aPath[0].col);
                createjs.Tween
                    .get(this.container)
                    .to({y:iFloor - 100}, iTime/2, createjs.Ease.cubicOut)
                    .to({y:iFloor}, iTime, createjs.Ease.bounceOut)
                    .call(() => {
                        createjs.Tween
                            .get(this.container)
                            .to({alpha:0}, 3000, createjs.Ease.cubicIn)
                            .call(() => {
                                this.unload();
                            });
                    });
                
            });
    };
    
    // _oParent = this;
    this.initBall(ballPosition, oParentContainer);
}

export default CBall;


