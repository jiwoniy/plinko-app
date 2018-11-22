import createjs from './createjs.js'

// import { mainInstance } from './CMain.js'
// import CTextButton from './CTextButton.js'
import settings from './settings.js'
// import CSpriteLibrary from './sprite_lib.js'
import CSpriteLibrary from './CSpriteLibrary.js'

import {
    createBitmap
} from './ctl_utils.js'
// import {
//     TEXT_PRELOADER_CONTINUE,
// } from './CLang.js'

function CPreloader({ parentMainInstance }) {
    this.self = this
    this._iMaskWidth = null
    this._iMaskHeight = null
    this._oLoadingText = null
    this._oProgressBar = null
    // this._oMaskPreloader = null
    // this._oFade = null
    // var _oIcon;
    // this._oIconMask = null
    // this._oButStart = null
    // this.container = null

    this.parentMainInstance = parentMainInstance;
    this.spriteLibrary = new CSpriteLibrary()

    this.spriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    this.spriteLibrary.addSprite("progress_bar", "/plinko/sprites/progress_bar.png");
    this.spriteLibrary.addSprite('plinko_background', "/plinko/sprites/plinko_background.svg");
    // this.spriteLibrary.addSprite('200x200', "./sprites/200x200.jpg");
    // this.spriteLibrary.addSprite("but_start", "./sprites/but_start.png");
    this.spriteLibrary.addSprite("play_button", "/plinko/sprites/play_button.svg");
    this.spriteLibrary.loadSprites();

    this.container = new createjs.Container();
    this.parentMainInstance.getStage().addChild(this.container);
}

CPreloader.prototype.attachSprites = function () {
    // const backgroundShape = new createjs.Shape();
    // backgroundShape.graphics
    //     .beginFill('black')
    //     .drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
    // this.container.addChild(backgroundShape);

    // const backgroundSprite = this.spriteLibrary.getSprite('200x200');
    const backgroundSprite = this.spriteLibrary.getSprite('plinko_background');
    const backgroundBitmap = createBitmap(backgroundSprite);

    // backgroundBitmap.regX = backgroundSprite.width * 0.5;
    // backgroundBitmap.regY = backgroundSprite.height * 0.5;
    // backgroundBitmap.x = settings.getCanvasWidth() / 2;
    // backgroundBitmap.y = (settings.getCanvasHeight() / 2) - 180;
    this.container.addChild(backgroundBitmap);

    // const iconMask = new createjs.Shape();
    // backgroundSprite.width = 360
    // backgroundSprite.height = 640
    // console.log(backgroundSprite.width)
    // console.log(settings.getCanvasWidth())
    // iconMask.graphics
        // .beginFill('rgba(0,0,0,0.01)')
        // .beginBitmapFill(backgroundSprite, 'no-repeat')
        // .drawRoundRect(backgroundBitmap.x - 100, backgroundBitmap.y - 100, 200, 200, 10);
        // .drawRoundRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight(), 10);
    // this.container.addChild(iconMask);
    // backgroundBitmap.mask = iconMask;

    // this.playButtonShape = new createjs.Shape();
    // const playButtonSprite = this.spriteLibrary.getSprite('play_button');
    // // const playButtonBitmap = createBitmap(playButtonSprite);

    // this.playButtonShape.graphics
    //     // .beginFill('black')
    //     .beginBitmapFill(playButtonSprite, 'no-repeat')
    //     .drawRect(0, 0, 800, 600);
    // // this.playButtonShape.setVisible(false);
    // this.playButtonShape.on('mousedown',function(){
    //     console.log('---')
    // });

    // this.container.addChild(this.playButtonShape);

    const progressBarSprite = this.spriteLibrary.getSprite('progress_bar');
    this._oProgressBar = createBitmap(progressBarSprite);
    this._oProgressBar.x = (settings.getCanvasWidth() / 2) - (progressBarSprite.width / 2);
    this._oProgressBar.y = (settings.getCanvasHeight() / 2) + 50;
    this.container.addChild(this._oProgressBar);

    this._iMaskWidth = progressBarSprite.width;
    this._iMaskHeight = progressBarSprite.height;
    this.preloaderShape = new createjs.Shape();
    this.preloaderShape.graphics
        .beginFill("rgba(0,0,0,0.01)")
        .drawRect(this._oProgressBar.x, this._oProgressBar.y, 1, this._iMaskHeight);
    this.container.addChild(this.preloaderShape);

    this._oProgressBar.mask = this.preloaderShape;

    this._oLoadingText = new createjs.Text("", "30px " + settings.PRIMARY_FONT, "#fff");
    this._oLoadingText.x = settings.getCanvasWidth() / 2;
    this._oLoadingText.y = (settings.getCanvasHeight() / 2) + 100;
    this._oLoadingText.textBaseline = "alphabetic";
    this._oLoadingText.textAlign = "center";
    this.container.addChild(this._oLoadingText);
    
    // this._oButStart = new CTextButton((settings.getCanvasWidth() / 2),
    //     settings.getCanvasHeight() / 2,
    //     playButtonSprite,
    //     TEXT_PRELOADER_CONTINUE,
    //     'Arial', '#000', 50, true,
    //     this.container);        
    // this.playButtonBitmap.addEventListener(settings.ON_MOUSE_UP, this._onButStartRelease, this);
    // this._oButStart.setVisible(false);
    // this._oButStart.setTextHeight(60);
    // this.playButtonBitmap.hideShadow();
    
    this.fadeShape = new createjs.Shape();
    this.fadeShape.graphics
        .beginFill('black')
        .drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
    this.container.addChild(this.fadeShape);
    
    createjs.Tween.get(this.fadeShape).to({alpha: 0}, 500).call(() => {            
        createjs.Tween.removeTweens(this.fadeShape);
        this.container.removeChild(this.fadeShape);
    });        
};

CPreloader.prototype.setPlayButton = function () {
    this.playButtonShape = new createjs.Shape();
    const playButtonSprite = this.spriteLibrary.getSprite('play_button');

    this.playButtonShape.graphics
        .beginBitmapFill(playButtonSprite, 'no-repeat')
        .drawRect(0, 0, 614, 380);

    this.playButtonShape.x = (settings.getCanvasWidth() * 0.5) - (playButtonSprite.width / 2);
    this.playButtonShape.y = (settings.getCanvasHeight() * 0.5) - (playButtonSprite.height / 2);;

    this.playButtonShape.on('mousedown',() => {
        this._onButStartRelease()
        this.unload()
    });

    this.container.addChild(this.playButtonShape);
}

CPreloader.prototype.refreshLoader = function (iPerc) {
    this._oLoadingText.text = iPerc + "%";
    
    if (iPerc === 100) {
        this._oLoadingText.visible = false;
        this._oProgressBar.visible = false;
        this.setPlayButton()
    };     

    this.preloaderShape.graphics.clear();
    var iNewMaskWidth = Math.floor((iPerc * this._iMaskWidth) / 100);
    this.preloaderShape.graphics
        .beginFill('rgba(0,0,0,0.01)')
        .drawRect(this._oProgressBar.x, this._oProgressBar.y, iNewMaskWidth, this._iMaskHeight);
};

CPreloader.prototype._onImagesLoaded = function () {};

CPreloader.prototype._onButStartRelease = function() {
    this.parentMainInstance.onRemovePreloader();
};

CPreloader.prototype._onAllImagesLoaded = function () {
    this.attachSprites();
    this.parentMainInstance.preloaderReady();
    // mainInstance().preloaderReady();
};

CPreloader.prototype.unload = function () {
    this.container.removeAllChildren();
    // this._oButStart.unload();
};

export default CPreloader;