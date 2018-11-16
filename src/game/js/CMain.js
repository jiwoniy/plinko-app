import $ from 'jquery'
import { Howl, Howler } from 'howler';

import createjs from './createjs.js'

import { playSound } from './ctl_utils.js'
import CPreloader from './CPreloader.js'
import CSpriteLibrary from './sprite_lib.js'
import CMenu from './CMenu.js'
import CGame from './CGame.js'
import settings from './settings.js'

function CMain(oData) {
    // var _bUpdate;
    // var _iCurResource = 0;
    // var RESOURCE_TO_LOAD = 0;
    // var _iState = settings.STATE_LOADING;
    // var _oData;
    
    // var _oPreloader;
    // var _oMenu;
    // var _oModeMenu;
    // var _oHelp;
    // var _oGame;

    this.oStage = null
    this.preloader = null

    this.state = {
        initData: oData || {},
        loadResources: 0,
        loadResourcesCounter: 0,
        // audioActive: true,
        audioActive: true,
        fullScreen: false,
        sounds: [],
        bUpdate: null,
        gameStatus: settings.STATE_LOADING,
        // sounds: [],
        menu: null,
        // soundsLoadedCnt: 0,
        // imagesLoadedCnt: 0,
        game: null,
    }

    this.initContainer = () => {
        // s_oCanvas = document.getElementById("canvas");
        if (document.getElementById("canvas")) {
            this.oStage = new createjs.Stage(document.getElementById("canvas"));
            this.oStage.preventSelection = true;
            createjs.Touch.enable(this.oStage);
            
            // s_bMobile = $.browser.mobile;
            if($.browser.mobile === false) {
                this.oStage.enableMouseOver(settings.FPS);  
                $('body').on('contextmenu', '#canvas', function(e){ return false; });
            }
            
            // s_iPrevTime = new Date().getTime();

            createjs.Ticker.addEventListener("tick", this._update);
            createjs.Ticker.framerate = settings.FPS;
            
            if(navigator.userAgent.match(/Windows Phone/i)) {
                settings.DISABLE_SOUND_MOBILE = true;
            }
            
            // s_oSpriteLibrary  = new CSpriteLibrary(true);
            //ADD PRELOADER
            
            // _oPreloader = new CPreloader();
            this.preloader = new CPreloader({ parentMainInstance: this });
        }
    };

    this.getStage = () => {
        return this.oStage;
    }

    this.getFullscreen = () => {
        return this.state.fullScreen
    }

    this.setFullScreen = (value) => {
        this.state.fullScreen = value
    }

    this.getAudioActive = () => {
        return this.state.audioActive
    }

    this.setAudioActive = (value) => {
        this.state.audioActive = value
    }

    this.getSounds = () => {
        return this.state.sounds;
    }
    
    this.preloaderReady = () => {
        if(settings.DISABLE_SOUND_MOBILE === false || $.browser.mobile === false) {
            this._initSounds();
        }
        
        this._loadImages();
        this.state.bUpdate = true;
    };
    
    this.soundLoaded = () => {
        this.state.loadResourcesCounter += 1;
        var iPerc = Math.floor((this.state.loadResourcesCounter / this.state.loadResources)*100);
        this.preloader.refreshLoader(iPerc);
    };
    
    this._initSounds = () => {
        const aSoundsInfo = [];
        
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_collision',loop:false,volume:1, ingamename: 'ball_collision'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_in_basket',loop:false,volume:1, ingamename: 'ball_in_basket'});
        aSoundsInfo.push({path: './sounds/',filename:'ball_in_basket_negative',loop:false,volume:1, ingamename: 'ball_in_basket_negative'});

        this.state.loadResources += aSoundsInfo.length;

        this.state.sounds = [];
        for(var i=0; i<aSoundsInfo.length; i++) {
            this.state.sounds[aSoundsInfo[i].ingamename] = new Howl({ 
                src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                autoplay: false,
                preload: true,
                loop: aSoundsInfo[i].loop, 
                volume: aSoundsInfo[i].volume,
                onload: this.soundLoaded
            });
        }

    };

    this._loadImages = () => {
        CSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        CSpriteLibrary.addSprite("logo_game","./sprites/logo_game.png");
        CSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");
        
        CSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        CSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        CSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        CSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        CSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        CSpriteLibrary.addSprite("but_no","./sprites/but_no.png");
        
        CSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg"); 
        CSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        CSpriteLibrary.addSprite("side_right","./sprites/side_right.png");
        CSpriteLibrary.addSprite("side_left","./sprites/side_left.png");
        
        CSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        CSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        CSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        CSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png"); 
        CSpriteLibrary.addSprite("but_home","./sprites/but_home.png"); 
        CSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");  
        
        CSpriteLibrary.addSprite("ball_panel","./sprites/ball_panel.png");
        
        CSpriteLibrary.addSprite("ball","./sprites/ball.png");
        CSpriteLibrary.addSprite("stake","./sprites/stake.png");
        CSpriteLibrary.addSprite("ball_generator","./sprites/ball_generator.png");
        
        CSpriteLibrary.addSprite("holes_occluder","./sprites/holes_occluder.png");
        CSpriteLibrary.addSprite("hole_board_occluder","./sprites/hole_board_occluder.png");
        
        CSpriteLibrary.addSprite("basket_display","./sprites/basket_display.jpg");
        CSpriteLibrary.addSprite("hand_anim","./sprites/hand_anim.png");
        
        for(let i = 0; i < settings.NUM_IMAGES_BACKGROUNDS; i += 1) {
            CSpriteLibrary.addSprite("image_"+i,"./sprites/prize/image_"+i+".png");
        }
        
        this.state.loadResources += CSpriteLibrary.getNumSprites();
        CSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = () => {
        this.state.loadResourcesCounter += 1;
        const iPerc = Math.floor((this.state.loadResourcesCounter / this.state.loadResources) * 100);
        //console.log("PERC: "+iPerc);
        this.preloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = () => { 
    };
    
    this._onRemovePreloader = () => {
        this.preloader.unload();
        // s_oSoundtrack = playSound('soundtrack', 1, true);
        playSound('soundtrack', 1, true);
        this.gotoMenu();
    };
    
    this.onAllPreloaderImagesLoaded = () => {
        this._loadImages();
    };
    
    this.gotoMenu = () => {
        this.state.menu = new CMenu(true);
        this.state.gameStatus = settings.STATE_MENU;
    };

    this.gotoGame = () => {
        this.state.game = new CGame(this.state.initData);   						
        this.state.gameStatus = settings.STATE_GAME;
    };
    
    // this.gotoHelp = function() {
    //     _oHelp = new CHelp();
    //     _iState = settings.STATE_HELP;
    // };
	
    this.stopUpdate = () => {
        this.state.bUpdate = false
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
     };

    this.startUpdate = () => {
        this.state.bUpdate = true
        // s_iPrevTime = new Date().getTime();
        
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");

        if (this.state.audioActive) {
            Howler.mute(false);
        }
    };
    
    this._update = (event) => {
		if (this.state.bUpdate === false) {
			return;
		}
        // var iCurTime = new Date().getTime();
        // s_iTimeElaps = iCurTime - s_iPrevTime;
        // s_iCntTime += s_iTimeElaps;
        // s_iCntFps++;
        // s_iPrevTime = iCurTime;
        
        // if ( s_iCntTime >= 1000 ){
        //     // s_iCurFps = s_iCntFps;
        //     s_iCntTime-=1000;
        //     s_iCntFps = 0;
        // }
                
        if (this.state.gameStatus === settings.STATE_GAME) {
            this.state.game.update();
        }
        
        this.oStage.update(event);
    };
    
    // s_oMain = this;
    
    // _oData = oData;
    
    settings.ENABLE_CREDITS = true;
    settings.ENABLE_FULLSCREEN = oData.fullscreen;
    settings.ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    settings.NUM_IMAGES_BACKGROUNDS = oData.total_images_backgrounds_in_folder;
    
    this.initContainer();
}
// var s_bMobile;
// var s_bAudioActive = true;
// var s_iCntTime = 0;
// var s_iTimeElaps = 0;
// var s_iPrevTime = 0;
// var s_iCntFps = 0;
// var s_iCurFps = 0;
// var s_bFullscreen = false;
// var s_aSounds = new Array();

// var s_oDrawLayer;
// var s_oStage;
// var s_oMain;
// var s_oSpriteLibrary;
// var s_oSoundtrack;
// var s_oCanvas;

const Singleton = (() => {
    let instance = null;
  
    function createInstance(data) {
        return new CMain(data);
    }
  
    return {
      getInstance(isConstructor, data) {
        if (isConstructor) {
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
