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

    var _aSlot;

    var _oController;

    this._init = function(oParentContainer){
        
        _oController = new createjs.Container();
        oParentContainer.addChild(_oController);
        
        var oSprite = CSpriteLibrary.getSprite('holes_occluder');
        var oBaseBoard = createBitmap(oSprite);
        oBaseBoard.regX = oSprite.width / 2;
        oBaseBoard.regY = oSprite.height / 2;
        oBaseBoard.x = settings.CANVAS_WIDTH / 2;
        oBaseBoard.y = 408;
        _oController.addChild(oBaseBoard);
        
        
        var oSprite = CSpriteLibrary.getSprite('hole_board_occluder');
        var aTubePos = [];
        for(let i = 0; i < settings.NUM_INSERT_TUBE; i += 1) {
            
            aTubePos.push({x: 288+i*140, y:356});
            
            var oTube = createBitmap(oSprite);
            oTube.regX = oSprite.width/2;
            oTube.regY = oSprite.height/2;
            oTube.x = aTubePos[i].x;
            oTube.y = aTubePos[i].y;
            _oController.addChild(oTube);
        }
        
        _aSlot = [];
        var oSprite = CSpriteLibrary.getSprite('bg_number');
        for(let i = 0; i< settings.NUM_INSERT_TUBE; i += 1) {
            
            var oSlot = new CSlot(aTubePos[i].x, aTubePos[i].y+ 20, 90, 100, _oController);
            oSlot.addEventListenerWithParams(settings.ON_MOUSE_UP, this._onSlot, this, i);
            
            _aSlot.push(oSlot);

        }
        
        this.hideSlots();
        
    };
    
    this.unload = function() {
        oParentContainer.removeChild(_oController);
    };
    
    this.checkBallOverlap = function(oPos) {
        var bOverlap = false;
        for(let i = 0; i < settings.NUM_INSERT_TUBE; i += 1) {
            bOverlap = _aSlot[i].checkOverlap(oPos);
            if(bOverlap){
                return {pos: _aSlot[i].getPos(), index:i};
            }
        }
    };
    
    this.getSlotPos = function(iIndex) {
        return _aSlot[iIndex].getPos();
    };
    
    this.hideSlots = function(){
        for(let i = 0; i < settings.NUM_INSERT_TUBE; i += 1) {
            _aSlot[i].setVisible(false);
        }
    };
    
    this.showSlots = function() {
        for(let i = 0; i < settings.NUM_INSERT_TUBE; i += 1) {
            _aSlot[i].setVisible(true);
        }
    };
    
    this._onSlot = function(iIndex) {
        gameInstance().launch(iIndex)
    };
    
    this._init(oParentContainer);
}

export default CInsertTubeController;



