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
    this.guiExpandibleContainer = null
    this.exitButtonContainer = null
    this.audioToggle = null
    this.fullscreenContainer = null
    this.ballNum = null
    this.exitButtonPos = null
    // this.audioButtonPos = null
    this.fullscreenBUttonPos = null

    this.state = {
        handAim: null,
        currentHandPosition: 0,
        // requestFullScreen: null
    }

    const doc = window.document;
    const docEl = doc.documentElement;
    this.requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    this.cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
    this.initInterface = (oBgContainer) => {
        const handAnimSprite = CSpriteLibrary.getImage('hand_anim');
        const iWidth = handAnimSprite.width / 6;
        const iHeight = handAnimSprite.height / 4;
        const spriteSheet = new createjs.SpriteSheet({
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
            animations: { 'idle': [0, 21] }
       });

    //    const ballSprite = CSpriteLibrary.getImage('ball');
    //    this.state.handAim = createBitmap(ballSprite);
        this.state.handAim = createSprite(spriteSheet, 'idle', iWidth / 2, iHeight / 2, iWidth, iHeight);

        const oPos = gameInstance.getSlotPosition(this.state.currentHandPosition);
        this.state.handAim.x = oPos.x;
        this.state.handAim.y = oPos.y;
        this.state.handAim.regX = (iWidth / 2) - 30;
        this.state.handAim.regY = iHeight / 2;
        // this.state.handAim.on('animationend', this._moveHand);
        mainInstance().getStage().addChild(this.state.handAim);
               
        const exitButtonSprite = CSpriteLibrary.getImage('but_exit');
        this.exitButtonPos = { x: settings.get10PercentWidth(), y: settings.get5PercentHeight() };
        this.exitButtonContainer = new CGfxButton(this.exitButtonPos.x, this.exitButtonPos.y, exitButtonSprite, mainInstance().getStage());
        this.exitButtonContainer.addEventListener(settings.ON_MOUSE_UP, this.onExit, this);
        
        if (settings.getIsAbleSound() === false || $.browser.mobile === false) {
            // let oExitX = this.exitButtonPos.x;
            this.audioButtonPos = {x: settings.get10PercentWidth(), y: (exitButtonSprite.height / 2) + 10};

            const soundActiveSprite = CSpriteLibrary.getImage('sound_active');
            const soundNoActiveSprite = CSpriteLibrary.getImage('sound_noactive');
            this.audioToggle = new CToggle(this.audioButtonPos.x, this.audioButtonPos.y, [soundActiveSprite, soundNoActiveSprite], mainInstance().getAudioActive(), mainInstance().getStage());
            this.audioToggle.addEventListener(settings.ON_MOUSE_UP, this.onAudioToggle, this);          
            // oExitX = this.audioButtonPos.x - (audioIconSprite.width / 2) - 10;
        }
        
        // if(settings.getEnableFullScreen() === false) {
        //     this.state.requestFullScreen = false;
        // }
        
        // if (settings.getEnableFullScreen() && screenfull.enabled) {
        //     const fullscreenSprite = CSpriteLibrary.getImage("but_fullscreen")
        //     this.fullscreenBUttonPos = {x: oExitX,y: (fullscreenSprite.height / 2) + 10};
        //     this.fullscreenContainer = new CToggle(this.fullscreenBUttonPos.x, this.fullscreenBUttonPos.y, fullscreenSprite, mainInstance().getFullscreen(), mainInstance().getStage());
        //     this.fullscreenContainer.addEventListener(settings.ON_MOUSE_UP, this._onFullscreenRelease, this);
        // }
        
        //////////////////////// BET CONTROLLER /////////////////////////
        const oControllerContainer = new createjs.Container();
        oControllerContainer.x = settings.getCanvasWidth() / 2;
        oControllerContainer.y = 1650;
        oBgContainer.addChild(oControllerContainer);

        const ballPanelSprite = CSpriteLibrary.getImage('ball_panel');
        const oBallNumBg = createBitmap(ballPanelSprite);
        oBallNumBg.regX = ballPanelSprite.width / 2;
        oBallNumBg.regY = ballPanelSprite.height / 2;
        oControllerContainer.addChild(oBallNumBg);

        this.ballNum = new createjs.Text(settings.getNumBall()," 40px "+ settings.PRIMARY_FONT, "#ffffff");
        this.ballNum.x = oBallNumBg.x;
        this.ballNum.y = oBallNumBg.y - 2;
        this.ballNum.textAlign = 'center';
        this.ballNum.textBaseline = 'middle';
        this.ballNum.lineWidth = 400;
        oControllerContainer.addChild(this.ballNum);
        
        // const settingsSprite = CSpriteLibrary.getImage('but_settings');
        const settingsSprite = CSpriteLibrary.getImage('menu_noActive');
        
        this.guiExpandibleContainer = new CGUIExpandible(this.exitButtonPos.x, this.exitButtonPos.y, settingsSprite, mainInstance().getStage());
        if (this.exitButtonContainer) {
            this.guiExpandibleContainer.addButton(this.exitButtonContainer);    
        }

        if (this.audioToggle) {
            this.guiExpandibleContainer.addButton(this.audioToggle);    
        }
        // if (settings.getEnableFullScreen() && screenfull.enabled) {
        //     this.guiExpandibleContainer.addButton(this.fullscreenContainer);
        // }
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.unload = () => {
        if (settings.getIsAbleSound() === false || $.browser.mobile === false) {
            this.audioToggle.unload();
            this.audioToggle = null;
        }

        this.exitButtonContainer.unload();
        if (settings.getEnableFullScreen() && screenfull.enabled) {
            this.fullscreenContainer.unload();
        }        

        this.guiExpandibleContainer.unload();
    };
    
    this.refreshButtonPos = (iNewX,iNewY) => {
        // this.guiExpandibleContainer.refreshPos(iNewX, iNewY);
    };

    this.refreshBallNum = (iValue) => {
        this.ballNum.text = iValue;
    };
    
    this.hideControls = () => {
        this.setHelpVisible(false);
    };
    
    this.showControls = () => {
        this.setHelpVisible(true);
    };
    
    this.setHelpVisible = (bVal) => {
       this.state.handAim.visible = bVal;
       if (bVal) {
        this.state.handAim.gotoAndPlay('idle');
       }
    };
    
    this._moveHand = () => {
        this.state.currentHandPosition += 1;
        if(this.state.currentHandPosition === settings.getInsertTubeNumber()) {
            this.state.currentHandPosition = 0;
        }
        const oPos = gameInstance.getSlotPosition(this.state.currentHandPosition);
        this.state.handAim.x = oPos.x;
        this.state.handAim.y = oPos.y;
    };  
  
    this._onButRestartRelease = () => {
        gameInstance.restartGame();
        $(mainInstance()).trigger("restart_level", 1);
    };
    
    this.onAudioToggle = () => {
        Howler.mute(mainInstance().getAudioActive());
        mainInstance().setAudioActive(!mainInstance().getAudioActive())
    };
    
    this.onExit = () => {
        new CAreYouSurePanel(gameInstance.onExit);
    };
    
    this.resetFullscreen = () => {
        if (settings.getEnableFullScreen() && screenfull.enabled) {
            this.fullscreenContainer.setActive(mainInstance().getFullscreen());
        }
    };
        
    this._onFullscreenRelease = () => {
        if(mainInstance().getFullscreen()) {
            this.cancelFullScreen.call(window.document);
        } else {
            this.requestFullScreen.call(window.document.documentElement);
        }
	
	    sizeHandler();
    };
        
    this.initInterface(oBgContainer);
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
