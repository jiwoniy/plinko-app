import createjs from './createjs.js'

// import { mainInstance } from './CMain.js'
import CTextButton from './CTextButton.js'
import settings from './settings.js'
// import CSpriteLibrary from './sprite_lib.js'
import CSpriteLibrary from './CSpriteLibrary.js'

import {
    createBitmap
} from './ctl_utils.js'
import {
    TEXT_PRELOADER_CONTINUE,
} from './CLang.js'

function CPreloader({ parentMainInstance }) {
    this._iMaskWidth = null
    this._iMaskHeight = null
    this._oLoadingText = null
    this._oProgressBar = null
    this._oMaskPreloader = null
    this._oFade = null
    // var _oIcon;
    // this._oIconMask = null
    this._oButStart = null
    // this.container = null

    this.parentMainInstance = parentMainInstance;
    this.spriteLibrary = new CSpriteLibrary()

    this.spriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
    this.spriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
    this.spriteLibrary.addSprite('plinko_background', "./sprites/plinko_background.svg");
    this.spriteLibrary.addSprite("but_start", "./sprites/but_start.png");
    this.spriteLibrary.loadSprites();

    this.container = new createjs.Container();
    this.parentMainInstance.getStage().addChild(this.container);
}

CPreloader.prototype.attachSprites = function () {
    const backgroundShape = new createjs.Shape();
    backgroundShape.graphics
        .beginFill('black')
        .drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
    this.container.addChild(backgroundShape);

    // const backgroundSprite = CSpriteLibrary.getSprite('200x200');
    const backgroundSprite = this.spriteLibrary.getSprite('plinko_background');
    const backgroundBitmap = createBitmap(backgroundSprite);
    // console.log(backgroundBitmap)
    // console.log(settings.getCanvasWidth())
    // console.log(settings.getCanvasHeight())
    // console.log(backgroundSprite.width)
    // console.log(backgroundSprite.height)
    backgroundBitmap.regX = backgroundSprite.width * 0.5;
    backgroundBitmap.regY = backgroundSprite.height * 0.5;
    // backgroundBitmap.regX = backgroundSprite.width * 0.5;
    // backgroundBitmap.regY = backgroundSprite.height * 0.5;
    backgroundBitmap.x = settings.getCanvasWidth() / 2;
    backgroundBitmap.y = (settings.getCanvasHeight() / 2) - 180;
    // backgroundBitmap.x = 0;
    // backgroundBitmap.y = 0;

    // backgroundBitmap.x = backgroundSprite.width
    // backgroundBitmap.y = backgroundSprite.height
    this.container.addChild(backgroundBitmap);

    // const iconMask = new createjs.Shape();
    // iconMask.graphics
    //     .beginFill('rgba(0,0,0,0.01)')
    //     // .drawRoundRect(backgroundBitmap.x - 100, backgroundBitmap.y - 100, 200, 200, 10);
    //     .drawRoundRect(backgroundBitmap.x, backgroundBitmap.y, backgroundSprite.width, backgroundSprite.height, 10);
    // this.container.addChild(iconMask);
    
    // backgroundBitmap.mask = iconMask;

    const progressBarSprite = this.spriteLibrary.getSprite('progress_bar');
    this._oProgressBar = createBitmap(progressBarSprite);
    this._oProgressBar.x = (settings.getCanvasWidth() / 2) - (progressBarSprite.width / 2);
    this._oProgressBar.y = (settings.getCanvasHeight() / 2) + 50;
    this.container.addChild(this._oProgressBar);

    this._iMaskWidth = progressBarSprite.width;
    this._iMaskHeight = progressBarSprite.height;
    this._oMaskPreloader = new createjs.Shape();
    this._oMaskPreloader.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(this._oProgressBar.x, this._oProgressBar.y, 1, this._iMaskHeight);

    this.container.addChild(this._oMaskPreloader);

    this._oProgressBar.mask = this._oMaskPreloader;

    this._oLoadingText = new createjs.Text("", "30px " + settings.PRIMARY_FONT, "#fff");
    this._oLoadingText.x = settings.getCanvasWidth() / 2;
    this._oLoadingText.y = (settings.getCanvasHeight() / 2) + 100;
    this._oLoadingText.textBaseline = "alphabetic";
    this._oLoadingText.textAlign = "center";
    this.container.addChild(this._oLoadingText);
    
    var oSprite = this.spriteLibrary.getSprite('but_start');
    this._oButStart = new CTextButton((settings.getCanvasWidth() / 2), settings.getCanvasHeight() / 2, oSprite, TEXT_PRELOADER_CONTINUE, "Arial", "#000", 50, true, this.container);        
    this._oButStart.addEventListener(settings.ON_MOUSE_UP, this._onButStartRelease, this);
    this._oButStart.setVisible(false);
    this._oButStart.setTextHeight(60);
    this._oButStart.hideShadow();
    
    this._oFade = new createjs.Shape();
    this._oFade.graphics.beginFill("black").drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
    this.container.addChild(this._oFade);
    
    createjs.Tween.get(this._oFade).to({alpha: 0}, 500).call(() => {            
        createjs.Tween.removeTweens(this._oFade);
        this.container.removeChild(this._oFade);
    });        
};

CPreloader.prototype.refreshLoader = function (iPerc) {
    this._oLoadingText.text = iPerc + "%";
    
    if (iPerc === 100) {
        this._oButStart.setVisible(true);
        this._oLoadingText.visible = false;
        this._oProgressBar.visible = false;
    };     

    this._oMaskPreloader.graphics.clear();
    var iNewMaskWidth = Math.floor((iPerc * this._iMaskWidth) / 100);
    this._oMaskPreloader.graphics.beginFill('rgba(0,0,0,0.01)').drawRect(this._oProgressBar.x, this._oProgressBar.y, iNewMaskWidth, this._iMaskHeight);
};

CPreloader.prototype._onImagesLoaded = function () {};

CPreloader.prototype._onButStartRelease = function() {
    // mainInstance()._onRemovePreloader();
    this.parentMainInstance._onRemovePreloader();
};

CPreloader.prototype._onAllImagesLoaded = function () {
    this.attachSprites();
    this.parentMainInstance.preloaderReady();
    // mainInstance().preloaderReady();
};

CPreloader.prototype.unload = function () {
    this.container.removeAllChildren();
    this._oButStart.unload();
};

export default CPreloader;