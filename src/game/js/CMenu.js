import $ from 'jquery'
import { Howler } from 'howler';

import createjs from './createjs.js'
import {
    s_iOffsetX,
    s_iOffsetY,
    createBitmap,
    sizeHandler
} from './ctl_utils.js'
import {
    mainInstance,
} from './CMain.js'
import CSpriteLibrary from './sprite_lib.js'
import CGfxButton from './CGfxButton.js'
import CCreditsPanel from './CCreditsPanel.js'
import CToggle from './CToggle.js'
import settings from './settings.js'
import screenfull from './screenfull.js'

function CMenu() {
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oCreditsBut;
    var _oButFullscreen;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosCredits;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    this._init = function(){
        _oBg = createBitmap(CSpriteLibrary.getSprite('bg_menu'));
        mainInstance().getStage().addChild(_oBg);

        var oSprite = CSpriteLibrary.getSprite('logo_menu');
        var oLogo = createBitmap(oSprite);
        oLogo.regX = oSprite.width/2;
        oLogo.regY = oSprite.height/2;
        oLogo.x = settings.CANVAS_WIDTH / 2
        oLogo.y = 500;
        mainInstance().getStage().addChild(oLogo);

        var oSprite = CSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((settings.CANVAS_WIDTH / 2), settings.CANVAS_HEIGHT - 540,oSprite, mainInstance().getStage());
        _oButPlay.addEventListener(settings.ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();
     
        var oSprite = CSpriteLibrary.getSprite('but_credits');
        var pFirstPos = {x:oSprite.width/2 + 10,y:oSprite.height/2 + 10};
        var pSecondPos = {x:pFirstPos.x + oSprite.width + 10,y:oSprite.height/2 + 10};
        _pStartPosCredits = {x: pFirstPos.x, y: pFirstPos.y};
        if(settings.ENABLE_CREDITS){
            _oCreditsBut = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite, mainInstance().getStage());
            _oCreditsBut.addEventListener(settings.ON_MOUSE_UP, this._onCreditsBut, this);
        }
     
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false){
            var oSprite = CSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: settings.CANVAS_WIDTH - (oSprite.width/4)- 10, y: (oSprite.height/2) + 10};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite, mainInstance().getAudioActive(), mainInstance().getStage());
            _oAudioToggle.addEventListener(settings.ON_MOUSE_UP, this._onAudioToggle, this);          
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(settings.ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            
            if(settings.ENABLE_CREDITS){
                _pStartPosFullscreen = pSecondPos;
            } else {
                _pStartPosFullscreen = pFirstPos;
            }
            
            oSprite = CSpriteLibrary.getSprite("but_fullscreen")
            //_pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, mainInstance().getFullscreen(), mainInstance().getStage());
            _oButFullscreen.addEventListener(settings.ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0, settings.CANVAS_WIDTH, settings.CANVAS_HEIGHT);
        
        mainInstance().getStage().addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        _oFade.visible = false;
        
        if(settings.ENABLE_CREDITS){
            _oCreditsBut.unload();
        }
        
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        mainInstance().getStage().removeAllChildren();
        _oBg = null;
        // s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(settings.ENABLE_CREDITS){
            _oCreditsBut.setPosition(_pStartPosCredits.x + iNewX,iNewY + _pStartPosCredits.y);
        }
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };
    
    this._onAudioToggle = function() {
        Howler.mute(mainInstance().getAudioActive());
        mainInstance().setAudioActive(!mainInstance().getAudioActive())
    };
    
    this._onCreditsBut = function(){
        new CCreditsPanel();
    };
    
    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(mainInstance().getFullscreen());
        }
    };
        
    this._onFullscreenRelease = function(){
	if(mainInstance().getFullscreen()) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onButPlayRelease = function(){
        
        this.unload();

        $(mainInstance()).trigger("start_session");
        mainInstance().gotoGame();
        
    };
	
    // s_oMenu = this;
    
    this._init();
}

// var s_oMenu = null;

const Singleton = (() => {
    let instance = null;
  
    function createInstance() {
        return new CMenu();
    }
  
    return {
      getInstance(isConstructor) {
        if (isConstructor) {
            instance = createInstance();
        } else if (!isConstructor && !instance) {
            instance = createInstance();
        }
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