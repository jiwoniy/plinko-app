import $ from 'jquery'
import { Howler } from 'howler';

import createjs from './createjs.js'
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
    s_iOffsetX,
    s_iOffsetY,
 } from './ctl_utils.js'
 import settings from './settings.js'
 import screenfull from './screenfull.js'

function CInterface(oBgContainer, gameInstance) {
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
    
    this._init = (oBgContainer) => {
        const handAnimSprite = CSpriteLibrary.getSprite('hand_anim');
        const iWidth = handAnimSprite.width / 6;
        const iHeight = handAnimSprite.height / 4;
        const oSpriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            images: [handAnimSprite], 
            // width, height & registration point of each sprite
            frames: [
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
            animations: {'idle': [0,21]}
       });

        _iCurHandPos = 0;
        _oHandAnim = createSprite(oSpriteSheet, 'idle', iWidth / 2, iHeight / 2, iWidth, iHeight);

        const oPos = gameInstance.getSlotPosition(_iCurHandPos);
        _oHandAnim.x = oPos.x;
        _oHandAnim.y = oPos.y;
        _oHandAnim.regX = (iWidth / 2) - 30;
        _oHandAnim.regY = iHeight / 2;
        _oHandAnim.on("animationend", this._moveHand);
        mainInstance().getStage().addChild(_oHandAnim);
               
        const exitButtonSprite = CSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = { x: settings.CANVAS_WIDTH - (exitButtonSprite.width / 2) - 10, y: (exitButtonSprite.height / 2) + 10 };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, exitButtonSprite, mainInstance().getStage());
        _oButExit.addEventListener(settings.ON_MOUSE_UP, this._onExit, this);
        
        let oExitX = _pStartPosExit.x - (exitButtonSprite.width) - 10;
        _pStartPosAudio = {x: oExitX, y: (exitButtonSprite.height / 2) + 10};
        
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false) {
            const audioIconSprite = CSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, audioIconSprite, mainInstance().getAudioActive(), mainInstance().getStage());
            _oAudioToggle.addEventListener(settings.ON_MOUSE_UP, this._onAudioToggle, this);          
            oExitX = _pStartPosAudio.x - (audioIconSprite.width/2) - 10;
        }

        const doc = window.document;
        const docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(settings.ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            const fullscreenSprite = CSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x: oExitX,y: (fullscreenSprite.height / 2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, fullscreenSprite, mainInstance().getFullscreen(), mainInstance().getStage());
            _oButFullscreen.addEventListener(settings.ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        //////////////////////// BET CONTROLLER /////////////////////////
        const oControllerContainer = new createjs.Container();
        oControllerContainer.x = settings.CANVAS_WIDTH / 2;
        oControllerContainer.y = 1650;
        oBgContainer.addChild(oControllerContainer);

        const ballPanelSprite = CSpriteLibrary.getSprite('ball_panel');
        const oBallNumBg = createBitmap(ballPanelSprite);
        oBallNumBg.regX = ballPanelSprite.width / 2;
        oBallNumBg.regY = ballPanelSprite.height / 2;
        oControllerContainer.addChild(oBallNumBg);

        _oBallNum = new createjs.Text(settings.getNumBall()," 40px "+ settings.PRIMARY_FONT, "#ffffff");
        _oBallNum.x = oBallNumBg.x;
        _oBallNum.y = oBallNumBg.y-2;
        _oBallNum.textAlign = "center";
        _oBallNum.textBaseline = "middle";
        _oBallNum.lineWidth = 400;
        oControllerContainer.addChild(_oBallNum);
        
        const settingsSprite = CSpriteLibrary.getSprite('but_settings');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, settingsSprite, mainInstance().getStage());
        _oGUIExpandible.addButton(_oButExit);
        _oGUIExpandible.addButton(_oAudioToggle);
        if (_fRequestFullScreen && screenfull.enabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.unload = () => {
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        _oButExit.unload();
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.unload();
        }        

        _oGUIExpandible.unload();
    };
    
    this.refreshButtonPos = (iNewX,iNewY) => {
        _oGUIExpandible.refreshPos(iNewX,iNewY);
    };

    this.refreshBallNum = (iValue) => {
        _oBallNum.text = iValue;
    };
    
    this.hideControls = () => {
        this.setHelpVisible(false);
    };
    
    this.showControls = () => {
        this.setHelpVisible(true);
    };
    
    this.setHelpVisible = (bVal) => {
       _oHandAnim.visible = bVal;
       if (bVal) {
           _oHandAnim.gotoAndPlay('idle');
       }
    };
    
    this._moveHand = () => {
        _iCurHandPos += 1;
        if(_iCurHandPos === settings.NUM_INSERT_TUBE) {
            _iCurHandPos = 0;
        }
        const oPos = gameInstance.getSlotPosition(_iCurHandPos);
        _oHandAnim.x = oPos.x;
        _oHandAnim.y = oPos.y;

    };  
    
    this._onButRestartRelease = () => {
        gameInstance.restartGame();
        $(mainInstance()).trigger("restart_level", 1);
    };
    
    this._onAudioToggle = () => {
        Howler.mute(mainInstance().getAudioActive());
        mainInstance().setAudioActive(!mainInstance().getAudioActive())
    };
    
    this._onExit = () => {
        new CAreYouSurePanel(gameInstance.onExit);
    };
    
    this.resetFullscreenBut = () => {
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(mainInstance().getFullscreen());
        }
    };
        
    this._onFullscreenRelease = () => {
        if(mainInstance().getFullscreen()) { 
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }
	
	    sizeHandler();
    };
        
    this._init(oBgContainer);
}

const Singleton = (() => {
    let instance = null;
    function createInstance(container, gameInstance) {
        return new CInterface(container, gameInstance);
    }
  
    return {
      getInstance: (isConstructor = false, container, gameInstance) => {
          // flag === true ===> constructor
        if (isConstructor) {
          instance = createInstance(container, gameInstance);
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
