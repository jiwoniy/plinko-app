import $ from 'jquery'
import { Howl, Howler } from 'howler';

import createjs from './createjs.js'

import { playSound } from './ctl_utils.js'
import CPreloader from './CPreloader.js'
import CSpriteLibrary from './sprite_lib.js'
import CMenu from './CMenu.js'
import settings from './settings.js'

function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = settings.STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = true;
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = $.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(settings.FPS);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = settings.FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)) {
            settings.DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();
        //ADD PRELOADER
        
        _oPreloader = new CPreloader();

    };
    
    this.preloaderReady = function(){
        if(settings.DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        
        var aSoundsInfo = new Array();
        
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_collision',loop:false,volume:1, ingamename: 'ball_collision'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_in_basket',loop:false,volume:1, ingamename: 'ball_in_basket'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_in_basket_negative',loop:false,volume:1, ingamename: 'ball_in_basket_negative'});

        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded
                                                        });
        }

    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("logo_game","./sprites/logo_game.png");
        s_oSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");
        
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no","./sprites/but_no.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg"); 
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("side_right","./sprites/side_right.png");
        s_oSpriteLibrary.addSprite("side_left","./sprites/side_left.png");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png"); 
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png"); 
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");  
        
        s_oSpriteLibrary.addSprite("ball_panel","./sprites/ball_panel.png");
        
        s_oSpriteLibrary.addSprite("ball","./sprites/ball.png");
        s_oSpriteLibrary.addSprite("stake","./sprites/stake.png");
        s_oSpriteLibrary.addSprite("ball_generator","./sprites/ball_generator.png");
        
        s_oSpriteLibrary.addSprite("holes_occluder","./sprites/holes_occluder.png");
        s_oSpriteLibrary.addSprite("hole_board_occluder","./sprites/hole_board_occluder.png");
        
        s_oSpriteLibrary.addSprite("basket_display","./sprites/basket_display.jpg");
        s_oSpriteLibrary.addSprite("hand_anim","./sprites/hand_anim.png");
        
        for(let i = 0; i < settings.NUM_IMAGES_BACKGROUNDS; i += 1) {
            s_oSpriteLibrary.addSprite("image_"+i,"./sprites/prize/image_"+i+".png");
        }
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor((_iCurResource / RESOURCE_TO_LOAD) * 100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
            
        s_oSoundtrack = playSound('soundtrack', 1, true);

        this.gotoMenu();
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = settings.STATE_MENU;
    };

    this.gotoGame = function(){
        _oGame = new CGame(_oData);   						
        _iState = settings.STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = settings.STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
     };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");

        if(s_bAudioActive){
                Howler.mute(false);
        }
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === settings.STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    
    settings.ENABLE_CREDITS = true;
    settings.ENABLE_FULLSCREEN = oData.fullscreen;
    settings.ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    settings.NUM_IMAGES_BACKGROUNDS = oData.total_images_backgrounds_in_folder;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_bFullscreen = false;
var s_aSounds = new Array();

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack;
var s_oCanvas;


const Singleton = (() => {
    let instance = null;
  
    function createInstance(data) {
        return new CMain(data);
    }
  
    return {
      getInstance(isConstructor, data) {
        if (isConstructor && !instance) {
          instance = createInstance(data);
        }
        return instance;
      },
    };
})();

const mainInstance = () => Singleton.getInstance(false)
export default Singleton.getInstance;
export {
    mainInstance,
}
