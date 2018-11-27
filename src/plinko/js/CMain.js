import $ from 'jquery'
import { Howl, Howler } from 'howler';

import createjs from './createjs.js'

import {
    checkGameState,
    playSound,
 } from './ctl_utils.js'
import CPreloader from './CPreloader.js'
import CSpriteLibrary from './sprite_lib.js'
import CMenu from './CMenu.js'
import CGame from './CGame.js'
import settings from './settings.js'

function CMain(oData) {
    // this.isActive = false
    this.stage = null
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
        gameInstance: null,
    }

    this.initContainer = () => {
        const canvasElement = document.getElementById("canvas");
        if (canvasElement) {
            settings.setCanvasHeight()
            settings.setCanvasWidth()

            this.stage = new createjs.Stage(canvasElement);

            this.stage.preventSelection = true;
            createjs.Touch.enable(this.stage);
            
            // s_bMobile = $.browser.mobile;
            if($.browser.mobile === false) {
                this.stage.enableMouseOver(settings.FPS);  
                $('body')
                .on('contextmenu', '#canvas', (e) => { return false; });
            }
            
            // s_iPrevTime = new Date().getTime();

            createjs.Ticker.addEventListener("tick", this._update);
            createjs.Ticker.framerate = settings.FPS;
            
            if(navigator.userAgent.match(/Windows Phone/i)) {
                settings.setIsAbleSound(true)
            }

            this.preloader = new CPreloader({ parentMainInstance: this });
            checkGameState()
        }
    };

    this.getStage = () => {
        return this.stage;
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

    this.setCanvasHeight = () => {
        settings.setCanvasHeight(0.8)
    }
    
    this.preloaderReady = () => {
        if (settings.getIsAbleSound() === false || $.browser.mobile === false) {
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
        
        aSoundsInfo.push({path: '/plinko/sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: '/plinko/sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: '/plinko/sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: '/plinko/sounds/',filename:'ball_collision',loop:false,volume:1, ingamename: 'ball_collision'});
        aSoundsInfo.push({path: '/plinko/sounds/',filename:'ball_in_basket',loop:false,volume:1, ingamename: 'ball_in_basket'});
        aSoundsInfo.push({path: '/plinko/sounds/',filename:'ball_in_basket_negative',loop:false,volume:1, ingamename: 'ball_in_basket_negative'});

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

        CSpriteLibrary.addImage("logo_game","/plinko/sprites/logo_game.png");
        CSpriteLibrary.addImage("logo_menu","/plinko/sprites/logo_menu.png");
        
        CSpriteLibrary.addImage("but_play","/plinko/sprites/but_play.png");
        CSpriteLibrary.addImage("msg_box","/plinko/sprites/msg_box.png");
        CSpriteLibrary.addImage("ctl_logo","/plinko/sprites/ctl_logo.png");
        CSpriteLibrary.addImage("but_credits","/plinko/sprites/but_credits.png");
        CSpriteLibrary.addImage("but_yes","/plinko/sprites/but_yes.png");
        CSpriteLibrary.addImage("but_no","/plinko/sprites/but_no.png");
        
        CSpriteLibrary.addImage("bg_menu","/plinko/sprites/bg_menu.jpg"); 
        // CSpriteLibrary.addSprite("bg_game","./sprites/game_background.svg");
        CSpriteLibrary.addImage("bg_game","/plinko/sprites/table_tennis_bg.svg");
        // CSpriteLibrary.addSprite("table_tennis","./sprites/table_tennis.svg");
        // CSpriteLibrary.addSprite("table_tennis","./sprites/tabletennis_net.svg");
        CSpriteLibrary.addImage("table_tennis","/plinko/sprites/tennis_net.svg");
        // CSpriteLibrary.addSprite("side_right","./sprites/side_right.png");
        // CSpriteLibrary.addSprite("side_left","./sprites/side_left.png");
        
        CSpriteLibrary.addImage("but_exit","/plinko/sprites/exit.svg");

        CSpriteLibrary.addImage("sound_active","/plinko/sprites/sound_active.svg");
        CSpriteLibrary.addImage("sound_noactive","/plinko/sprites/sound_noactive.svg");

        CSpriteLibrary.addImage("but_fullscreen","/plinko/sprites/but_fullscreen.png");
        CSpriteLibrary.addImage("but_restart","/plinko/sprites/but_restart.png"); 
        CSpriteLibrary.addImage("but_home","/plinko/sprites/but_home.png"); 
        CSpriteLibrary.addImage("but_settings","/plinko/sprites/but_settings.png");  

        CSpriteLibrary.addImage("menu_noActive","/plinko/sprites/menu_white.svg");  
        
        CSpriteLibrary.addImage("ball_panel","/plinko/sprites/ball_panel.png");
        
        CSpriteLibrary.addImage("racket","/plinko/sprites/table_tennis_racket.svg");
        CSpriteLibrary.addImage("racket_purple","/plinko/sprites/table_tennis_racket_purple.svg");
        CSpriteLibrary.addImage("ball","/plinko/sprites/ball.svg");
        // CSpriteLibrary.addSprite("stake","/plinko/sprites/stake.png");
        CSpriteLibrary.addImage("stake","/plinko/sprites/stake_small.svg");
        CSpriteLibrary.addImage("ball_generator","/plinko/sprites/ball_generator.png");
        
        CSpriteLibrary.addImage("holes_occluder","/plinko/sprites/holes_occluder.png");
        CSpriteLibrary.addImage("hole_board_occluder","/plinko/sprites/hole_board_occluder.png");
        
        CSpriteLibrary.addImage("basket_display","/plinko/sprites/basket_display.svg");
        CSpriteLibrary.addImage("hand_anim","./plinko/sprites/hand_anim.png");
        
        CSpriteLibrary.addImage("basket_prize","/plinko/sprites/prize/prize.svg");
        for(let i = 0; i < settings.getBasketImageNumber(); i += 1) {
            CSpriteLibrary.addImage("image_"+i,"/plinko/sprites/prize/image_"+i+".png");
        }
        
        this.state.loadResources += CSpriteLibrary.getNumSprites();
        CSpriteLibrary.loadImages();
    };

    this.changeGameStatus = (gameStatus) => {
        this.state.gameStatus = gameStatus
    }
    
    this._onImagesLoaded = () => {
        this.state.loadResourcesCounter += 1;
        const iPerc = Math.floor((this.state.loadResourcesCounter / this.state.loadResources) * 100);
        //console.log("PERC: "+iPerc);
        this.preloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = () => { 
    };
    
    this.onRemovePreloader = () => {
        this.preloader.unload();
        // s_oSoundtrack = playSound('soundtrack', 1, true);
        // Sound off
        playSound('soundtrack', 1, true);
        // this.gotoMenu();
        this.gotoGame();
    };
    
    this.onAllPreloaderImagesLoaded = () => {
        this._loadImages();
    };
    
    // this.gotoMenu = () => {
    //     this.state.menu = new CMenu(true, this);
    //     this.state.gameStatus = settings.STATE_MENU;
    // };

    this.gotoGame = () => {
        this.state.gameInstance = new CGame(true, this.state.initData, this);   						
        this.changeGameStatus(settings.STATE_GAME)
        $(this).trigger("start_game");
    };

    this.endGame = () => {
        this.stage.removeAllChildren();
        this.changeGameStatus(settings.STATE_LOADING)
        $(this).trigger("end_game");
    }
    
	
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
            this.state.gameInstance.update();
        }
        
        this.stage.update(event);
    };

    this.sizeHandler = () => {
        settings.setCanvasHeight()
        settings.setCanvasWidth()
    }
    
    // s_oMain = this;
    
    // _oData = oData;
    
    settings.ENABLE_CREDITS = true;
    // settings.ENABLE_FULLSCREEN = oData.fullscreen;
    settings.setEnableFullScreen(oData.check_orientation)
    settings.setEnableCheckOrientation(oData.check_orientation)
    // settings.ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    settings.setBasketImageNumber(oData.total_images_backgrounds_in_folder)
    
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
