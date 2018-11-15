import $ from 'jquery'
import { Howler } from 'howler';

import createjs from './createjs.js'
import {
    gameInstance
} from './CGame.js'
import {
    mainInstance,
} from './CMain.js'
import CSpriteLibrary from './sprite_lib.js'
import CGfxButton from './CGfxButton.js'
import CToggle from './CToggle.js'
import CAreYouSurePanel from './CAreYouSurePanel.js'
import CGUIExpandible from './CGUIExpandible.js'
import {
    createBitmap,
    createSprite,
    sizeHandler,
 } from './ctl_utils.js'
 import settings from './settings.js'
 import screenfull from './screenfull.js'

function CInterface(oBgContainer) {

    var _oAudioToggle;
    var _oButExit;
    var _oButFullscreen;
    var _oGUIExpandible;
    
    var _iCurHandPos;
    
    var _oBallNum;
    var _oHandAnim;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    this._init = function(oBgContainer){      
        
        var oSprite = CSpriteLibrary.getSprite('hand_anim');
        var iWidth = oSprite.width/6;
        var iHeight = oSprite.height/4;
        var oData = {   framerate: 20,
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        "frames": [
                                [1, 1, 256, 230, 0, 0, 0],
                                [259, 1, 256, 230, 0, 0, 0],
                                [517, 1, 256, 230, 0, 0, 0],
                                [775, 1, 256, 230, 0, 0, 0],
                                [1033, 1, 256, 230, 0, 0, 0],
                                [1291, 1, 256, 230, 0, 0, 0],
                                [1, 233, 256, 230, 0, 0, 0],
                                [259, 233, 256, 230, 0, 0, 0],
                                [517, 233, 256, 230, 0, 0, 0],
                                [775, 233, 256, 230, 0, 0, 0],
                                [1033, 233, 256, 230, 0, 0, 0],
                                [1291, 233, 256, 230, 0, 0, 0],
                                [1, 465, 256, 230, 0, 0, 0],
                                [259, 465, 256, 230, 0, 0, 0],
                                [517, 465, 256, 230, 0, 0, 0],
                                [775, 465, 256, 230, 0, 0, 0],
                                [1033, 465, 256, 230, 0, 0, 0],
                                [1291, 465, 256, 230, 0, 0, 0],
                                [1, 697, 256, 230, 0, 0, 0],
                                [259, 697, 256, 230, 0, 0, 0],
                                [517, 697, 256, 230, 0, 0, 0],
                                [775, 697, 256, 230, 0, 0, 0]
                            ],
                        animations:{"idle": [0,21]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _iCurHandPos = 0;
        _oHandAnim = createSprite(oSpriteSheet, "idle",iWidth/2,iHeight/2,iWidth,iHeight);
        var oPos = gameInstance().getSlotPosition(_iCurHandPos);
        _oHandAnim.x = oPos.x;
        _oHandAnim.y = oPos.y;
        _oHandAnim.regX = iWidth/2 - 30;
        _oHandAnim.regY = iHeight/2;
        _oHandAnim.on("animationend", this._moveHand);
        mainInstance().getStage().addChild(_oHandAnim);
            
            
        var oExitX;        
        
        var oSprite = CSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:settings. CANVAS_WIDTH - (oSprite.width / 2) - 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, mainInstance().getStage());
        _oButExit.addEventListener(settings.ON_MOUSE_UP, this._onExit, this);
        
        oExitX = _pStartPosExit.x - (oSprite.width) - 10;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false) {
            var oSprite = CSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, mainInstance().getAudioActive(), mainInstance().getStage());
            _oAudioToggle.addEventListener(settings.ON_MOUSE_UP, this._onAudioToggle, this);          
            
            oExitX = _pStartPosAudio.x - (oSprite.width/2) - 10;
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(settings.ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = CSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oExitX,y:oSprite.height/2+10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, mainInstance().getFullscreen(), mainInstance().getStage());
            _oButFullscreen.addEventListener(settings.ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        //////////////////////// BET CONTROLLER /////////////////////////
        var oControllerContainer = new createjs.Container();
        oControllerContainer.x = settings.CANVAS_WIDTH / 2;
        oControllerContainer.y = 1650;
        oBgContainer.addChild(oControllerContainer);

        var oSprite = CSpriteLibrary.getSprite('ball_panel');
        var oBallNumBg = createBitmap(oSprite);
        oBallNumBg.regX = oSprite.width/2;
        oBallNumBg.regY = oSprite.height/2;
        oControllerContainer.addChild(oBallNumBg);

        
        _oBallNum = new createjs.Text(settings.NUM_BALL," 40px "+ settings.PRIMARY_FONT, "#ffffff");
        _oBallNum.x = oBallNumBg.x;
        _oBallNum.y = oBallNumBg.y-2;
        _oBallNum.textAlign = "center";
        _oBallNum.textBaseline = "middle";
        _oBallNum.lineWidth = 400;
        oControllerContainer.addChild(_oBallNum);


        
        var oSprite = CSpriteLibrary.getSprite('but_settings');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, oSprite, mainInstance().getStage());
        _oGUIExpandible.addButton(_oButExit);
        _oGUIExpandible.addButton(_oAudioToggle);
        if (_fRequestFullScreen && screenfull.enabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }
        
        
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.unload = function() {
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        _oButExit.unload();

        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.unload();
        }        

        _oGUIExpandible.unload();

        // s_oInterface = null;
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY) {
        _oGUIExpandible.refreshPos(iNewX,iNewY);
    };

    this.refreshBallNum = function(iValue) {
        _oBallNum.text = iValue;
    };

    
    this.hideControls = function() {
        this.setHelpVisible(false);
    };
    
    this.showControls = function() {
        this.setHelpVisible(true);
    };
    
    this.setHelpVisible = function(bVal) {
       _oHandAnim.visible = bVal;
       if(bVal){
           _oHandAnim.gotoAndPlay("idle");
       }
    };
    
    this._moveHand = function() {
        _iCurHandPos++;
        if(_iCurHandPos === settings.NUM_INSERT_TUBE) {
            _iCurHandPos = 0;
        }
        var oPos = gameInstance().getSlotPosition(_iCurHandPos);
        _oHandAnim.x = oPos.x;
        _oHandAnim.y = oPos.y;

    };  
    
    this._onButRestartRelease = function() {
        gameInstance().restartGame();
        $(mainInstance()).trigger("restart_level", 1);
    };

    
    this._onAudioToggle = function() {
        Howler.mute(mainInstance().audioActive());
        mainInstance().setAudioActive(!mainInstance().audioActive())
    };
    
    this._onExit = function() {
        new CAreYouSurePanel(gameInstance().onExit);
    };
    
    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(mainInstance().getFullscreen());
        }
    };
        
    this._onFullscreenRelease = function() {
        if(mainInstance().getFullscreen()) { 
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }
	
	    sizeHandler();
    };
    
    // s_oInterface = this;
    
    this._init(oBgContainer);
    
    // return this;
}


const Singleton = (() => {
    let instance = null;
    function createInstance(container) {
        return new CInterface(container);
    }
  
    return {
      getInstance: (isConstructor = false, container) => {
          // flag === true ===> constructor
        if (isConstructor) {
          instance = createInstance(container);
        } else if (isConstructor && !instance) {
            instance = createInstance(container);
        }
        return instance;
      },
    };
})();
const interfaceInstance = () => Singleton.getInstance(false)

export default Singleton.getInstance;
export {
    interfaceInstance
}

// var s_oInterface = null;