import createjs from './createjs.js'

import {
    createBitmap,
 } from './ctl_utils.js'
import {
    mainInstance,
} from './CMain.js'
import CGfxButton from './CGfxButton.js'
import CSpriteLibrary from './sprite_lib.js'
import settings from './settings.js'
import {
    TEXT_ARE_SURE,
  } from './CLang.js'

function CAreYouSurePanel(oConfirmFunction, oNegateFunction) {
    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    var _oListener;
    
    var _pStartPanelPos;

    this._init = function (oConfirmFunction, oNegateFunction) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, settings.getCanvasWidth(), settings.getCanvasHeight());
        _oFade.alpha = 0;
        _oListener = _oFade.on("mousedown",function(){});
        mainInstance().getStage().addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        mainInstance().getStage().addChild(_oPanelContainer);
        
        var oSprite = CSpriteLibrary.getImage('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = settings.getCanvasWidth() / 2;
        _oPanelContainer.y = settings.getCanvasHeight() + (oSprite.height / 2);
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer).to({y: (settings.getCanvasHeight() / 2) - 40},500, createjs.Ease.quartIn);
        /*
        var oTitleStroke = new createjs.Text(TEXT_ARE_SURE," 34px "+PRIMARY_FONT, "#000000");
        oTitleStroke.y = -oSprite.height/2 + 120;
        oTitleStroke.textAlign = "center";
        oTitleStroke.textBaseline = "middle";
        oTitleStroke.lineWidth = 400;
        oTitleStroke.outline = 5;
        _oPanelContainer.addChild(oTitleStroke);
        */
        var oTitle = new createjs.Text(TEXT_ARE_SURE," 60px "+settings.PRIMARY_FONT, "#ffffff");
        oTitle.y = -oSprite.height/2 + 160;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 400;
        _oPanelContainer.addChild(oTitle);

        _oButYes = new CGfxButton(110, 80, CSpriteLibrary.getImage('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(settings.ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(-110, 80, CSpriteLibrary.getImage('but_no'), _oPanelContainer);
        _oButNo.addEventListener(settings.ON_MOUSE_UP, this._onButNo, this);
        _oButNo.pulseAnimation();
    };

    this._onButYes = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            if(oConfirmFunction){
                oConfirmFunction();
            }
        }); 
    };

    this._onButNo = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            if(oNegateFunction){
                oNegateFunction();
            }
        }); 
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();

        mainInstance().getStage().removeChild(_oFade);
        mainInstance().getStage().removeChild(_oPanelContainer);

        _oFade.off("mousedown",_oListener);
    };

    _oParent = this;
    this._init(oConfirmFunction, oNegateFunction);
}

export default CAreYouSurePanel;

