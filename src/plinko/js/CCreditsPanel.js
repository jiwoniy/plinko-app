import createjs from './createjs.js'
import {
    mainInstance,
} from './CMain.js'
import {
    createBitmap,
} from './ctl_utils.js'
import CGfxButton from './CGfxButton.js'
import CSpriteLibrary from './sprite_lib.js'
import settings from './settings.js'

function CCreditsPanel() {
    var _oFade;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    var _oHitArea;
    var _oListener;
    
    var _pStartPanelPos;
    
    this._init = () => {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
        _oFade.alpha = 0;
        mainInstance().getStage().addChild(_oFade);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        mainInstance().getStage().addChild(_oHitArea);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        mainInstance().getStage().addChild(_oPanelContainer);
        
        const msgBoxSprite = CSpriteLibrary.getImage('msg_box');
        const oPanel = createBitmap(msgBoxSprite);        
        oPanel.regX = msgBoxSprite.width / 2;
        oPanel.regY = msgBoxSprite.height / 2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = settings.getCanvasWidth() / 2;
        _oPanelContainer.y = settings.getCanvasHeight() + (msgBoxSprite.height / 2);
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween
            .get(_oPanelContainer)
            .to({ y: (settings.getCanvasHeight() / 2) - 40 }, 500, createjs.Ease.quartIn);

        const oTitle = new createjs.Text("DEVELOPED BY"," 50px "+ settings.PRIMARY_FONT, "#ffffff");
        oTitle.y = -100;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 300;
        _oPanelContainer.addChild(oTitle);

        const oLink = new createjs.Text("www.ecoblock.com"," 50px "+ settings.PRIMARY_FONT, "#ffffff");
        oLink.y = 90;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 300;
        _oPanelContainer.addChild(oLink);
        
        const ctlLogoSprite = CSpriteLibrary.getImage('ctl_logo');
        _oLogo = createBitmap(ctlLogoSprite);
        _oLogo.regX = ctlLogoSprite.width / 2;
        _oLogo.regY = ctlLogoSprite.height / 2;
        _oPanelContainer.addChild(_oLogo);
      
        const exitButtonSprite = CSpriteLibrary.getImage('but_exit');
        _oButExit = new CGfxButton(298, -200, exitButtonSprite, _oPanelContainer);
        _oButExit.addEventListener(settings.ON_MOUSE_UP, this.unload, this);
        
    };
    
    this.unload = () => {
        _oButExit.setClickable(false);
        
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            mainInstance().getStage().removeChild(_oFade);
            mainInstance().getStage().removeChild(_oPanelContainer);
            mainInstance().getStage().removeChild(_oHitArea);

            _oButExit.unload();
        }); 
        
        _oHitArea.off("click",_oListener);
    };
    
    this._onLogoButRelease = () => {
        window.open("http://www.ecoblock.com/index.php?&l=en");
    };
    
    this._onMoreGamesReleased = () => {
        window.open("http://ecoblock.net/");
    };
    
    this._init();
};

export default CCreditsPanel;

