import $ from 'jquery'
import { Howler } from 'howler';

import createjs from './createjs.js'
import {
    s_iOffsetX,
    s_iOffsetY,
    createBitmap,
    sizeHandler
} from './ctl_utils.js'
import CSpriteLibrary from './sprite_lib.js'
import CGfxButton from './CGfxButton.js'
import CCreditsPanel from './CCreditsPanel.js'
// import CToggle from './CToggle.js'
import settings from './settings.js'
import screenfull from './screenfull.js'

function CMenu(mainInstance) {
    // var _oBg;
    var _oButPlay;
    var _oFade;
    // var _oAudioToggle;
    var _oCreditsBut;
    // var _oButFullscreen;
    
    // var _fRequestFullScreen = null;
    // var _fCancelFullScreen = null;
    
    var _pStartPosCredits;
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    this.audioToggle = null
    this.mainInstance = mainInstance

    const doc = window.document;
    const docEl = doc.documentElement;
    this.requestFullscreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    this.cancelFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    
    this._init = function() {
        const backgroundMenuSprite = createBitmap(CSpriteLibrary.getImage('bg_menu'));
        this.mainInstance.getStage().addChild(backgroundMenuSprite);

        const logoMenuSprite = CSpriteLibrary.getImage('logo_menu');
        var oLogo = createBitmap(logoMenuSprite);
        oLogo.regX = logoMenuSprite.width / 2;
        oLogo.regY = logoMenuSprite.height / 2;
        oLogo.x = settings.getCanvasWidth() / 2
        oLogo.y = 500;
        this.mainInstance.getStage().addChild(oLogo);

        const playButtonSprite = CSpriteLibrary.getImage('but_play');
        _oButPlay = new CGfxButton((settings.getCanvasWidth() / 2), settings.getCanvasHeight() - 540, playButtonSprite, this.mainInstance.getStage());
        _oButPlay.addEventListener(settings.ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();
     
        const creditsButtonSprite = CSpriteLibrary.getImage('but_credits');
        const pFirstPos = { x: (creditsButtonSprite.width / 2) + 10,y: (creditsButtonSprite.height / 2) + 10 };
        const pSecondPos = { x: pFirstPos.x + creditsButtonSprite.width + 10,y: creditsButtonSprite.height/2 + 10 };
        _pStartPosCredits = { x: pFirstPos.x, y: pFirstPos.y };
        if (settings.ENABLE_CREDITS) {
            _oCreditsBut = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, creditsButtonSprite, this.mainInstance.getStage());
            _oCreditsBut.addEventListener(settings.ON_MOUSE_UP, this._onCreditsBut, this);
        }
     
        // if (settings.getIsAbleSound() === false || $.browser.mobile === false) {
        //     const audioIconSprite = CSpriteLibrary.getImage('sound_active');
        //     _pStartPosAudio = {x: settings.getCanvasWidth() - (audioIconSprite.width / 4) - 10, y: (audioIconSprite.height / 2) + 10};            
        //     this.audioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, audioIconSprite, this.mainInstance.getAudioActive(), this.mainInstance.getStage());
        //     this.audioToggle.addEventListener(settings.ON_MOUSE_UP, this._onAudioToggle, this);          
        // }

        // if (settings.getEnableFullScreen() === false) {
        //     _fRequestFullScreen = false;
        // }

        if (settings.getEnableFullScreen() && screenfull.enabled) {
            if (settings.ENABLE_CREDITS) {
                _pStartPosFullscreen = pSecondPos;
            } else {
                _pStartPosFullscreen = pFirstPos;
            }
            
            const fullscreenButtonSprite = CSpriteLibrary.getImage("but_fullscreen")
            //_pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            // _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, fullscreenButtonSprite, this.mainInstance.getFullscreen(), this.mainInstance.getStage());
            // _oButFullscreen.addEventListener(settings.ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0, settings.getCanvasWidth(), settings.getCanvasHeight());
        
        this.mainInstance.getStage().addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({ alpha: 0 }, 1000).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.unload = () => {
        _oButPlay.unload(); 
        _oButPlay = null;
        _oFade.visible = false;
        
        if (settings.ENABLE_CREDITS) {
            _oCreditsBut.unload();
        }
        
        if (settings.getIsAbleSound() === false || $.browser.mobile === false) {
            this.audioToggle.unload();
            this.audioToggle = null;
        }
        
        // if (settings.getEnableFullScreen() && screenfull.enabled){
        //     _oButFullscreen.unload();
        // }
        
        this.mainInstance.getStage().removeAllChildren();
        // _oBg = null;
        // s_oMenu = null;
    };
    
    this.refreshButtonPos = (iNewX, iNewY) => {
        if (settings.ENABLE_CREDITS) {
            _oCreditsBut.setPosition(_pStartPosCredits.x + iNewX,iNewY + _pStartPosCredits.y);
        }
        if (settings.getIsAbleSound() === false || $.browser.mobile === false){
            this.audioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        // if (settings.getEnableFullScreen() && screenfull.enabled) {
        //     _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        // }
    };
    
    this._onAudioToggle = () => {
        Howler.mute(this.mainInstance.getAudioActive());
        this.mainInstance.setAudioActive(!this.mainInstance.getAudioActive())
    };
    
    this._onCreditsBut = function() {
        new CCreditsPanel();
    };
    
    this.resetFullscreen = function() {
        // if (settings.getEnableFullScreen() && screenfull.enabled) {
        //     _oButFullscreen.setActive(this.mainInstance.getFullscreen());
        // }
    };
        
    this._onFullscreenRelease = function() {
        if (this.mainInstance.getFullscreen()) { 
            this.cancelFullscreen.call(window.document);
        } else {
            this.requestFullscreen.call(window.document.documentElement);
        }
	
	    sizeHandler();
    };
    
    this._onButPlayRelease = function() {
        this.unload();

        $(this.mainInstance).trigger("start_session");
        this.mainInstance.gotoGame();
    };
	
    // s_oMenu = this;
    
    this._init();
}

// var s_oMenu = null;

const Singleton = (() => {
    let instance = null;
  
    function createInstance(mainInstance) {
        return new CMenu(mainInstance);
    }
  
    return {
      getInstance(isConstructor, mainInstance) {
        if (isConstructor) {
            instance = createInstance(mainInstance);
        }
        // } else if (!isConstructor && !instance) {
        //     instance = createInstance();
        // }
        // if (isConstructor && !instance) {
        //   instance = createInstance();
        // }
        return instance;
      },
    };
})();
const menuInstance = () => Singleton.getInstance(false)

export default Singleton.getInstance;
export {
    menuInstance
}