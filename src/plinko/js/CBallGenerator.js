import createjs from './createjs.js'
import settings from './settings.js'
// import {
//     createBitmap,
//  } from './ctl_utils.js'
import CBall from './CBall.js'
// import CSpriteLibrary from './sprite_lib.js'

function CBallGenerator(parentContainer) {
    const BALL_IN_TUBE = 2
    const BALL_IN_ANIMATION = 2
    // _pStartPoint = {x: 182, y: 264};
    // const tubeStartPosition = settings.getTubeStartPosition()
    const tubeStartPosition = {
        x: settings.get10PercentWidth(),
        y: settings.get10PercentHeight()
    }
    // const ballStartPoint = { x: tubeStartPosition.x, y: tubeStartPosition.y }
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
        
        this.state.ballRadius = settings.getBallRadius()
        for (let i = 0; i < BALL_IN_TUBE; i += 1) {
            const ballPosition = { x: tubeStartPosition.x - (i * this.state.ballRadius), y: tubeStartPosition.y} ;
            this.state.ball[i] = new CBall(ballPosition, this.container);
        }
        this.state.ball[0].setWaiting(true)
    };
    
    this.unload = () => {
        parentContainer.removeChild(this.container);
        // parentContainer.removeChild(_oFrontContainer);
    };
    
    this.shiftBallAnimation = () => {
        this.state.ball.splice(0, 1);
        
        const iLastIndex = BALL_IN_TUBE - 1;
        const ballPosition = { x: tubeStartPosition.x - (iLastIndex * this.state.ballRadius), y: tubeStartPosition.y };
        // this.state.ball[iLastIndex] = new CBall(ballPosition, this.container);
        this.state.ball.push(new CBall(ballPosition, this.container));
        
        for(let i = 0; i < BALL_IN_ANIMATION; i += 1) {
            const innerBallPosition = { x: tubeStartPosition.x - (i * this.state.ballRadius), y: tubeStartPosition.y};
            createjs.Tween
                .get(this.state.ball[i].getImage(), { override: true })
                .wait(i * 200)
                .to({ x: innerBallPosition.x }, 1000, createjs.Ease.cubicIn);
        }
    };
    
    this.getNextBall = () => {
        this.state.ball[1].setWaiting(true)
        return this.state.ball[0];
    };
    
    // _oParent = this;
    this.initBallGenerator(parentContainer);
}

export default CBallGenerator;


