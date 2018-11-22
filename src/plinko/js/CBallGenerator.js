import createjs from './createjs.js'
import settings from './settings.js'
// import {
//     createBitmap,
//  } from './ctl_utils.js'
import CBall from './CBall.js'
// import CSpriteLibrary from './sprite_lib.js'

function CBallGenerator(parentContainer) {
    const BALL_IN_TUBE = 3
    const BALL_IN_ANIMATION = 2
    // _pStartPoint = {x: 182, y: 264};
    const tubeStartPosition = settings.getTubeStartPosition()
    const ballStartPoint = { x: tubeStartPosition.x, y: tubeStartPosition.y }
    this.container = null
    this.state = {
        ballRadius: 0,
        ball: []
    }
    
    this.initBallGenerator = (parentContainer) => {
        this.container = new createjs.Container();
        parentContainer.addChild(this.container);
        
        // _oFrontContainer = new createjs.Container();
        // parentContainer.addChild(_oFrontContainer)
        
        this.state.ballRadius = settings.getBallRadius() * 2
        // this.state.ball = [];
        for(let i = 0; i < BALL_IN_TUBE; i += 1) {
            const ballPosition = {x: ballStartPoint.x - (i * this.state.ballRadius), y: ballStartPoint.y};
            this.state.ball[i] = new CBall(ballPosition, this.container);
        }
    };
    
    this.unload = () => {
        parentContainer.removeChild(this.container);
        // parentContainer.removeChild(_oFrontContainer);
    };
    
    this.shiftBallAnimation = () => {
        this.state.ball.splice(0, 1);
        
        const iLastIndex = BALL_IN_TUBE - 1;
        
        const ballPosition = { x: ballStartPoint.x - (iLastIndex * this.state.ballRadius), y: ballStartPoint.y };
        this.state.ball[iLastIndex] = new CBall(ballPosition, this.container);
        
        for(let i = 0; i < BALL_IN_ANIMATION; i += 1) {
            const innerBallPosition = { x: ballStartPoint.x - (i * this.state.ballRadius), y: ballStartPoint.y};
            createjs.Tween.get(this.state.ball[i].getSprite(), { override: true }).wait(i*200).to({ x: innerBallPosition.x }, 1000, createjs.Ease.cubicIn);
        }
    };
    
    this.getNextBall = () => {
        return this.state.ball[0];
    };
    
    // _oParent = this;
    this.initBallGenerator(parentContainer);
}

export default CBallGenerator;


