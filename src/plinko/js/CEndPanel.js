import $ from 'jquery'

import createjs from './createjs.js'
import {
    createBitmap,
  } from './ctl_utils.js'
import {
    mainInstance,
} from './CMain.js'
import {
    gameInstance,
} from './CGame.js'
import CSpriteLibrary from './sprite_lib.js'
import CGfxButton from './CGfxButton.js'
import settings from './settings.js'
import {
    TEXT_WIN,
    TEXT_REDEEM,
    TEXT_GAMEOVER,
  } from './CLang.js'

function CEndPanel(prizeIndex, isWin) {
    // var _oFade;
    // var _oParent;
    // var _oListener;
    
    // var _pStartPanelPos;

    this.exitButton = null
    this.fadeShape = null
    this.panelContainer = null
    
    this.initEndPanel = (prizeIndex, isWin) => {
        this.fadeShape = new createjs.Shape();
        this.fadeShape.graphics
            .beginFill("black")
            .drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());

        this.fadeShape.alpha = 0;
        // _oListener = this.fadeShape.on('mousedown',function(){});
        mainInstance().getStage().addChild(this.fadeShape);
        
        createjs.Tween
            .get(this.fadeShape)
            .to({ alpha: 0.7 }, 500);
        
        this.panelContainer = new createjs.Container();        
        mainInstance().getStage().addChild(this.panelContainer);
        
        // const msgBoxSprite = CSpriteLibrary.getImage('msg_box');
        // const panel = createBitmap(msgBoxSprite);        
        // panel.regX = msgBoxSprite.width / 2;
        // panel.regY = msgBoxSprite.height / 2;
        // this.panelContainer.addChild(panel);
        // panel.on('click', this.redeem);
        // panel.cursor = "pointer";
        
        // _oPanelContainer.x = settings.getCanvasWidth() / 2;
        // _oPanelContainer.y = settings.getCanvasHeight() + (msgBoxSprite.height / 2);
        // _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween
            .get(this.panelContainer)
            .to({ y: (settings.getCanvasHeight() / 2)} , 500, createjs.Ease.quartIn);

        if (isWin) {
            const textDisplay = new createjs.Text(TEXT_WIN, `30px ${settings.PRIMARY_FONT}`, "#ffffff");
            // textDisplay.textAlign = "center";
            // textDisplay.textBaseline = "middle";
            textDisplay.x = (settings.getCanvasWidth() / 2) - (textDisplay.getBounds().width / 2)
            textDisplay.y = 70
            this.panelContainer.addChild(textDisplay);
            
            const szPrize = settings.getPrize()[prizeIndex].background;
            const prizeSprite = CSpriteLibrary.getImage(szPrize);
            const prizeBitmap = createBitmap(prizeSprite); 
            prizeBitmap.x = (settings.getCanvasWidth() / 2) - (prizeBitmap.getBounds().width / 2)
            prizeBitmap.y = 100
            this.panelContainer.addChild(prizeBitmap);
            // oPrize.regX = prizeSprite.width / 2;
            // oPrize.regY = prizeSprite.height / 2;
            
            const redeemDisplay = new createjs.Text(TEXT_REDEEM," 30px "+ settings.PRIMARY_FONT, "#ffffff");
            redeemDisplay.x = (settings.getCanvasWidth() / 2) - (redeemDisplay.getBounds().width / 2)
            redeemDisplay.y = 140;
            // oRedeem.textAlign = "center";
            // oRedeem.textBaseline = "middle";
            // oRedeem.lineWidth = 300;
            this.panelContainer.addChild(redeemDisplay);
        } else {
            const textDisplay = new createjs.Text(TEXT_GAMEOVER," 30px "+ settings.PRIMARY_FONT, "#ffffff");
            textDisplay.x = (settings.getCanvasWidth() / 2) - (textDisplay.getBounds().width / 2)
            textDisplay.textBaseline = "middle";
            this.panelContainer.addChild(textDisplay);
            
            this.exitButton = new CGfxButton(settings.getCanvasWidth() / 2, 80, CSpriteLibrary.getImage('but_home'), this.panelContainer);
            this.exitButton.addEventListener(settings.ON_MOUSE_UP, this.onExit, this);
        }

        
        $(mainInstance()).trigger("save_score", prizeIndex);        
        $(mainInstance()).trigger("share_event", prizeIndex);
    };
    
    this.unload = () => {
        // this.fadeShape.off('mousedown', _oListener);
        mainInstance().getStage().removeChild(this.fadeShape);
        mainInstance().getStage().removeChild(this.panelContainer);
        
        if (!isWin) {
            this.exitButton.unload();
        }
    };

    this.redeem = () => {
        this.onExit();
        if(settings.getPrize()[prizeIndex].redeemlink !== "") {
            window.open(settings.getPrize()[prizeIndex].redeemlink);
        }
    };  
    
    this.onExit = () => {
        if (settings.getPrize()[prizeIndex].redeemlink !== "") {
            window.open(settings.getPrize()[prizeIndex].redeemlink);
        }
        
        $(mainInstance()).trigger("show_interlevel_ad");

        this.unload();
        
        gameInstance().onExit();
    };
    
    this.initEndPanel(prizeIndex, isWin);

    return this;
}

export default CEndPanel;
