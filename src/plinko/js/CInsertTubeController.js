import createjs from './createjs.js'
import CSpriteLibrary from './sprite_lib.js'
import {
    createBitmap,
 } from './ctl_utils.js'
 import settings from './settings.js'
 import {
    gameInstance
} from './CGame.js'
import CSlot from './CSlot.js'

function CInsertTubeController(oParentContainer) {
    // var _aSlot;
    // var _oController;
    this.slots = []
    this.container = null

    this.initInsertTubeController = (oParentContainer) => {
        this.container = new createjs.Container();
        oParentContainer.addChild(this.container);
        
        // const holesOccluderSprite = CSpriteLibrary.getSprite('holes_occluder');
        // const oBaseBoard = createBitmap(holesOccluderSprite);
        // console.log(holesOccluderSprite.width)
        // console.log(holesOccluderSprite.height)
        // oBaseBoard.regX = holesOccluderSprite.width / 2;
        // oBaseBoard.regY = holesOccluderSprite.height / 2;
        // oBaseBoard.x = settings.getCanvasWidth() / 2;
        // oBaseBoard.y = 408;
        // this.container.addChild(oBaseBoard);
        
        // const holesBoardOccluderSprite = CSpriteLibrary.getSprite('hole_board_occluder');
        const tubePos = [];
        const tubeStartPosition = settings.getTubeStartPosition()
        for(let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
            tubePos.push({ x: tubeStartPosition.x + (i * settings.getCellGapSize()), y: tubeStartPosition.y });
            // const oTube = createBitmap(holesBoardOccluderSprite);
            // oTube.regX = holesBoardOccluderSprite.width / 2;
            // oTube.regY = holesBoardOccluderSprite.height / 2;
            // oTube.x = aTubePos[i].x;
            // oTube.y = aTubePos[i].y;
            // this.container.addChild(oTube);
        }
        
        // var oSprite = CSpriteLibrary.getSprite('bg_number');
        for(let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
            const oSlot = new CSlot(tubePos[i].x, tubePos[i].y + 20, 90, 100, this.container);
            oSlot.addEventListenerWithParams(settings.ON_MOUSE_UP, this.onSlot, this, i);
            
            this.slots.push(oSlot);
        }
        
        this.hideSlots();
    };
    
    this.unload = () => {
        oParentContainer.removeChild(this.container);
    };
    
    this.checkBallOverlap = (oPos) => {
        var bOverlap = false;
        for(let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
            bOverlap = this.slots[i].checkOverlap(oPos);
            if(bOverlap){
                return { pos: this.slots[i].getPos(), index: i };
            }
        }
    };
    
    this.getSlotPos = (index) => {
        return this.slots[index].getPos();
    };
    
    this.hideSlots = () => {
        for (let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
            this.slots[i].setVisible(false);
        }
    };
    
    this.showSlots = () => {
        for (let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
            this.slots[i].setVisible(true);
        }
    };
    
    this.onSlot = (iIndex) => {
        gameInstance().launch(iIndex)
    };
    
    this.initInsertTubeController(oParentContainer);
}

export default CInsertTubeController;



