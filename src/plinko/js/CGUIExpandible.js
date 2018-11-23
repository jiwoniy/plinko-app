import createjs from './createjs.js'
import CGfxButton from './CGfxButton.js'
import settings from './settings.js'

function CGUIExpandible(xPosition, yPosition, oSprite, oParentContainer) {
    // var _bExpanded;
    
    var _aButtons;
    
    // var _oParent;
    // var _oMenuBut;
    // var _oGUIContainer;
    var _oBackContainer;
    var _oFrontContainer;
    var _oExpandedPos;

    this.guiContainer = null
    this.settingButton = null

    this.state = {
        menuExpanded: false
    }
    
    // var _pStartPos;
    
    this.initGuiExpandible = function(xPosition, yPosition, oSprite, oParentContainer) {
        _aButtons = [];
        // _pStartPos = {x: iX, y: iY};
        this.guiContainer = new createjs.Container();
        this.guiContainer.x = xPosition;
        this.guiContainer.y = yPosition;
        oParentContainer.addChild(this.guiContainer);
        
        _oBackContainer = new createjs.Container();
        this.guiContainer.addChild(_oBackContainer);
        
        _oFrontContainer = new createjs.Container();
        this.guiContainer.addChild(_oFrontContainer);
        
        this.settingButton = new CGfxButton(0,0,oSprite, _oFrontContainer);
        this.settingButton.addEventListener(settings.ON_MOUSE_UP, this.onSetting, this);
        
        var oStart = { x: 0, y: 120 };
        _oExpandedPos = { start: oStart, offset: 120 };
    };
    
    this.unload = () => {
        this.settingButton.unload();
        oParentContainer.removeChild(this.guiContainer);
    };
    
    this.refreshPos = (iNewX, iNewY) => {
        ////REMOVE ALL BUTTONS FROM REFRESH FUNCTIONS IN INTERFACE OR IN OTHER MENUES
        this.guiContainer.x = xPosition - iNewX;
        this.guiContainer.y = yPosition + iNewY;
    };
    
    this.addButton = (oObjClass) => {
        const oButton = oObjClass.getButtonImage();
        
        oButton.x = 0;
        oButton.y = 0;
        oButton.visible = 0;
        _oBackContainer.addChildAt(oButton, 0);
        
        _aButtons.push(oButton);
    };
    
    this.onSetting = () => {
        this.state.menuExpanded = !this.state.menuExpanded;
        
        if (this.state.menuExpanded) {
            this.expandMenu();
        } else {
            this.collapseMenu();
        }
    };
    
    this.expandMenu = () => {
        var iTime = 300;
        for(let i = 0; i < _aButtons.length; i += 1) {
            _aButtons[i].visible = true;
            createjs.Tween.get(_aButtons[i], {override:true}).wait(i*iTime/2).to({y: _oExpandedPos.start.y + i*_oExpandedPos.offset}, iTime, createjs.Ease.cubicOut);
        };
    };
    
    this.collapseMenu = () => {
        var iTime = 300;
        for(let i = 0; i < _aButtons.length; i += 1) {
            var oButton = _aButtons[_aButtons.length-1-i];
            createjs.Tween.get(oButton, {override:true}).wait(i*iTime/2).to({y: 0}, iTime, createjs.Ease.cubicOut).call(function(oButton){
                oButton.visible = false;
            }, [oButton]);
        };
    };
    
    // _oParent = this;
    this.initGuiExpandible(xPosition, yPosition, oSprite, oParentContainer);
}

export default CGUIExpandible;


