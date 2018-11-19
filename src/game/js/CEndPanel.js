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

function CEndPanel(iPrizeIndex, bHasWin) {
    var _oButExit;
    var _oFade;
    var _oPanelContainer;
    // var _oParent;
    var _oListener;
    
    // var _pStartPanelPos;
    
    this._init = (iPrizeIndex, bHasWin) => {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
        _oFade.alpha = 0;
        _oListener = _oFade.on("mousedown",function(){});
        mainInstance().getStage().addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        mainInstance().getStage().addChild(_oPanelContainer);
        
        const msgBoxSprite = CSpriteLibrary.getSprite('msg_box');
        const panel = createBitmap(msgBoxSprite);        
        panel.regX = msgBoxSprite.width / 2;
        panel.regY = msgBoxSprite.height / 2;
        _oPanelContainer.addChild(panel);
        
        _oPanelContainer.x = settings.getCanvasWidth() / 2;
        _oPanelContainer.y = settings.getCanvasHeight() + (msgBoxSprite.height / 2);
        // _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer).to({y: (settings.getCanvasHeight() / 2) - 40},500, createjs.Ease.quartIn);

        if (bHasWin) {
            const oTitle = new createjs.Text(TEXT_WIN," 60px "+ settings.PRIMARY_FONT, "#ffffff");
            oTitle.y = -(msgBoxSprite.height / 2) + 140;
            oTitle.textAlign = "center";
            oTitle.textBaseline = "middle";
            oTitle.lineWidth = 400;
            oTitle.lineHeight = 70;
            _oPanelContainer.addChild(oTitle);
            
            const szPrize = settings.getPrize()[iPrizeIndex].background;
            const prizeSprite = CSpriteLibrary.getSprite(szPrize);
            const oPrize = createBitmap(prizeSprite);        
            oPrize.regX = prizeSprite.width / 2;
            oPrize.regY = prizeSprite.height / 2;
            
            const oRedeem = new createjs.Text(TEXT_REDEEM," 60px "+ settings.PRIMARY_FONT, "#ffffff");
            oRedeem.y = 140;
            oRedeem.textAlign = "center";
            oRedeem.textBaseline = "middle";
            oRedeem.lineWidth = 600;
            _oPanelContainer.addChild(oRedeem);
            
            _oPanelContainer.addChild(oPrize);
            
            panel.on("click",this.redeem);
            panel.cursor = "pointer";
        } else {
            const oTitle = new createjs.Text(TEXT_GAMEOVER," 60px "+ settings.PRIMARY_FONT, "#ffffff");
            oTitle.y = -(msgBoxSprite.height / 2) + 140;
            oTitle.textAlign = "center";
            oTitle.textBaseline = "middle";
            oTitle.lineWidth = 600;
            oTitle.lineHeight = 70;
            _oPanelContainer.addChild(oTitle);
            
            _oButExit = new CGfxButton(0, 80, CSpriteLibrary.getSprite('but_home'), _oPanelContainer);
            _oButExit.addEventListener(settings.ON_MOUSE_UP, this._onExit, this);
        }

        
        $(mainInstance()).trigger("save_score",iPrizeIndex);        
        
        
    
        $(mainInstance()).trigger("share_event",iPrizeIndex);
        
    };
    
    this.unload = () => {
        _oFade.off("mousedown",_oListener);
        mainInstance().getStage().removeChild(_oFade);
        mainInstance().getStage().removeChild(_oPanelContainer);
        
        if (!bHasWin) {
            _oButExit.unload();
        }
    };

    this.redeem = () => {
        this._onExit();
        if(settings.getPrize()[iPrizeIndex].redeemlink !== ""){
            window.open(settings.getPrize()[iPrizeIndex].redeemlink);
        }
        
    };  
    
    this._onExit = () => {
        if(settings.getPrize()[iPrizeIndex].redeemlink !== ""){
            window.open(settings.getPrize()[iPrizeIndex].redeemlink);
        }
        
        $(mainInstance()).trigger("show_interlevel_ad");

        this.unload();
        
        gameInstance().onExit();
    };
    
    // _oParent = this;
    this._init(iPrizeIndex, bHasWin);

    return this;
}

export default CEndPanel;
