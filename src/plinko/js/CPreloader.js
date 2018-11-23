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
    this.spriteLibrary.addImage("progress_bar", "/plinko/sprites/progress_bar.png");
    this.spriteLibrary.addImage('plinko_background', "/plinko/sprites/plinko_background.svg");
    // this.spriteLibrary.addSprite('200x200', "./sprites/200x200.jpg");
    // this.spriteLibrary.addSprite("but_start", "./sprites/but_start.png");
    this.spriteLibrary.addImage("play_button", "/plinko/sprites/play_button.svg");
    this.spriteLibrary.loadImages();

    this.container = new createjs.Container();
    this.parentMainInstance.getStage().addChild(this.container);
}

CPreloader.prototype.attachSprites = function () {
    const backgroundSprite = this.spriteLibrary.getImage('plinko_background');

    const backgroundBitmap = createBitmap(backgroundSprite);
    this.container.addChild(backgroundBitmap);

    const progressBarSprite = this.spriteLibrary.getImage('progress_bar');
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
    const playButtonSprite = this.spriteLibrary.getImage('play_button');

    this.playButtonShape.graphics
        .beginBitmapFill(playButtonSprite, 'no-repeat')
        .drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());

    this.playButtonShape.x = (settings.getCanvasWidth() * 0.5) - (playButtonSprite.width / 2);
    this.playButtonShape.y = (settings.getCanvasHeight() * 0.5) - (playButtonSprite.height / 2);

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