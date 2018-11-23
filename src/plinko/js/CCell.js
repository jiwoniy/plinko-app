import createjs from './createjs.js'

import {
    createBitmap,
 } from './ctl_utils.js'
import CSpriteLibrary from './sprite_lib.js'
import settings from './settings.js'

function CCell(xPosition, yPosition, parentContainer, rows, cols, oStakeContainer) {
    this.container = null
    this.hightlightShape = null
    this.stakeSprite = null

    this.initCell = function(xPosition, yPosition, parentContainer, rows, cols, oStakeContainer) {
        this.parentContainer = parentContainer
        this.container = new createjs.Container();
        this.container.x = xPosition;
        this.container.y = yPosition;
        this.container.alpha = 0;
        this.parentContainer.addChild(this.container);

        const stakeSprite = CSpriteLibrary.getImage('stake');
        this.stakeSprite = createBitmap(stakeSprite);
        // this.stakeSprite.regX = stakeSprite.width / 2;
        // console.log(`xPosition: ${xPosition}`)
        // console.log(`yPosition: ${yPosition}`)
        this.stakeSprite.x = xPosition;
        this.stakeSprite.y = yPosition;
        this.parentContainer.addChild(this.stakeSprite);

        // const iWidth = 100;
        // const iHeight = 100;
        // this.hightlightShape = new createjs.Shape();
        // this.hightlightShape.graphics
        //     .beginFill("rgba(255,255,255,0.51)")
        //     .drawRect(-iWidth / 2, -iHeight / 2, iWidth, iHeight);
        // this.hightlightShape.visible = false;
        // this.hightlightShape.rotation = 45;
        // this.container.addChild(this.hightlightShape);
        
        /////////ACTIVATE THIS FUNCTION TO CHECK BALL PATH
        //this._debug();
    };
    
    this.unload = () => {
        this.parentContainer.removeChild(this.container);
    };
    
    this.getCenterPos = () => {
        return { x: xPosition, y: yPosition };
    };
    
    // this.getPivotPos = () => {
    //     return { x: xPosition, y: yPosition + settings.CELL_PIVOT_FROM_CENTER} ;
    // };
    
    this.getCenterOfBallOnPivot = () => {
        return { x: xPosition, y: yPosition + settings.getCellPivotFronCenter() - settings.getBallRadius() };
    };
    
    // this.checkBallOverlap = (oPos) => {
    //     var iXDiff = oPos.x - xPosition;
    //     var iYDiff = oPos.y - yPosition;
    //     var iBallRad = settings.getBallRadius() * settings.getBallRadius();
        
    //     return (iXDiff * iXDiff + iYDiff * iYDiff < iBallRad);
    //     //return _oCell.hitTest(oPos.x, oPos.y);
    // };
    
    this.removeStake = () => {
        if (this.stakeSprite) {
            this.stakeSprite.visible = false;
        }
    };
    
    this.highlight = (bVal) => {
        if (this.hightlightShape) {
            this.hightlightShape.visible = bVal;
        }
    };
    
    // this._debug = () => {
    //     this.container.alpha = 1;
        
    //     var szFormat = 'bold 30px Arial';
    //     var oDebugTextStroke = new createjs.Text(rows +","+cols,szFormat, "#000000");
    //     oDebugTextStroke.textAlign = "center";
    //     oDebugTextStroke.textBaseline = "middle";
    //     oDebugTextStroke.lineWidth = 200;
    //     oDebugTextStroke.outline = 4;
    //     this.container.addChild(oDebugTextStroke);
        
    //     var oDebugText = new createjs.Text(oDebugTextStroke.text,szFormat, "#ffffff");
    //     oDebugText.textAlign = oDebugTextStroke.textAlign;
    //     oDebugText.textBaseline = oDebugTextStroke.textBaseline;
    //     oDebugText.lineWidth = oDebugTextStroke.lineWidth;
    //     this.container.addChild(oDebugText);
    // };
    
    // _oParent = this;
    this.initCell(xPosition, yPosition, parentContainer, rows, cols, oStakeContainer);
}

export default CCell;