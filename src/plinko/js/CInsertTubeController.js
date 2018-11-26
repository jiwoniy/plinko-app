import createjs from './createjs.js'
// import CSpriteLibrary from './sprite_lib.js'
// import {
//     createBitmap,
//  } from './ctl_utils.js'
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
        
        // const holesOccluderSprite = CSpriteLibrary.getImage('holes_occluder');
        // const oBaseBoard = createBitmap(holesOccluderSprite);
        // oBaseBoard.regX = holesOccluderSprite.width / 2;
        // oBaseBoard.regY = holesOccluderSprite.height / 2;
        // oBaseBoard.x = settings.getCanvasWidth() / 2;
        // oBaseBoard.y = 408;
        // this.container.addChild(oBaseBoard);
        
        // const holesBoardOccluderSprite = CSpriteLibrary.getImage('hole_board_occluder');
        const slotArray = [];
        const tubeBelowSlotPosition = 10 // TODO(jiwon)
        const slotStartPosition = {
            x: settings.get10PercentWidth(),
            y: settings.get10PercentHeight() + tubeBelowSlotPosition
        }

        const slotHeight = 50 // TODO(jiwon)
        const gap = settings.getCellGapSize()
        const slotWidth = gap
        
        this.container.x = slotStartPosition.x
        // this.container.setBounds(0, 0)
        for (let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
            slotArray.push({ x: (slotWidth / 2) + (i * gap), y: slotStartPosition.y });
        }
        
        for (let i = 0; i < slotArray.length; i += 1) {
            const slot = new CSlot(slotArray[i].x, slotArray[i].y, slotWidth, slotHeight, this.container, i);
            slot.addEventListenerWithParams(settings.ON_MOUSE_UP, this.onSlot, this, i);
            this.slots.push(slot);
        }
        
        this.hideSlots();
    };
    
    this.unload = () => {
        oParentContainer.removeChild(this.container);
    };
    
    // this.checkBallOverlap = (oPos) => {
    //     var bOverlap = false;
    //     for(let i = 0; i < settings.getInsertTubeNumber(); i += 1) {
    //         bOverlap = this.slots[i].checkOverlap(oPos);
    //         if(bOverlap){
    //             return { pos: this.slots[i].getPos(), index: i };
    //         }
    //     }
    // };
    
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
    
    this.onSlot = (ballIndex) => {
        gameInstance().launch(ballIndex)
    };
    
    this.initInsertTubeController(oParentContainer);
}

export default CInsertTubeController;



