import $ from 'jquery'
import createjs from './createjs.js'
import {
    playSound,
    createSprite
} from './ctl_utils.js'
import settings from './settings.js'

function CToggle(xPosition, yPosition, spriteImage, isActive, parentContainer) {
    // var _bActive;
    
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oListenerMouseOver;
    
    // var _aCbCompleted;
    // var _aCbOwner;

    this.button = null
    this.state = {
        isActive: null
    }
    
    this.initToggle = (xPosition, yPosition, spriteImage, isActive, parentContainer) => {
        this.callbackCompleted = [];
        this.callbackOwner = []
        // _aCbOwner = [];

        // TODO spriteImage ==> Array
        const spriteSheet = new createjs.SpriteSheet({
            images: [...spriteImage], 
            // width, height & registration point of each sprite
            // frames: {
            //     width: spriteImage[0].width,
            //     height: spriteImage[0].height,
            //     regX: (spriteImage[0].width / 2),
            //     regY: spriteImage[0].height / 2
            // }, 
            frames: [
                [0 , 0, spriteImage[0].width, spriteImage[0].height, 0, spriteImage[0].width / 2],
                [0 , 0, spriteImage[1].width, spriteImage[1].height, 1, spriteImage[1].width / 2],
            ],
            animations: {state_true:[0], state_false:[1]}
            });
            
        this.state.isActive = isActive
        this.button = createSprite(spriteSheet,
            `state_${this.state.isActive}`,
            spriteImage[0].width / 2,
            // spriteImage[0].height / 2,
            0,
            spriteImage[0].width,
            spriteImage[0].height,
        );
            
        this.button.x = xPosition;
        this.button.y = yPosition; 
        this.button.stop();
        
        parentContainer.addChild(this.button);
        this.initListener();
    };
    
    this.unload = () => {
        if ($.browser.mobile) {
            this.button.off("mousedown", _oListenerMouseDown);
            this.button.off("pressup" , _oListenerMouseUp);
        } else {
            this.button.off("mousedown", _oListenerMouseDown);
            this.button.off("mouseover", _oListenerMouseOver);
            this.button.off("pressup" , _oListenerMouseUp);
        }
        
        this.button.parent.removeChild(this.button);
        //oParentContainer.removeChild(_oButton);
    };
    
    this.initListener = () => {
        if ($.browser.mobile) {
            _oListenerMouseDown = this.button.on("mousedown", this.buttonDown);
            _oListenerMouseUp = this.button.on("pressup" , this.buttonRelease);
        } else {
            _oListenerMouseDown = this.button.on("mousedown", this.buttonDown);
            _oListenerMouseOver = this.button.on("mouseover", this.buttonOver);
            _oListenerMouseUp = this.button.on("pressup" , this.buttonRelease);
        }     
    };
    
    this.addEventListener = (iEvent,cbCompleted, cbOwner) => {
        this.callbackCompleted[iEvent] = cbCompleted;
        this.callbackOwner[iEvent] = cbOwner; 
    };
    
    this.setActive = (value) => {
        this.state.isActive = value
        this.button.gotoAndStop("state_"+value);
    };
    
    this.buttonRelease = () => {
        this.button.scaleX = 1;
        this.button.scaleY = 1;
        
        playSound('click', 1, false);
        
        this.state.isActive = !this.state.isActive
        this.button.gotoAndStop("state_"+this.state.isActive);

        if (this.callbackCompleted[settings.ON_MOUSE_UP]) {
            this.callbackCompleted[settings.ON_MOUSE_UP]
                .call(this.callbackOwner[settings.ON_MOUSE_UP], this.state.isActive);
        }
    };
    
    this.buttonDown = () => {
        this.button.scaleX = 0.9;
        this.button.scaleY = 0.9;

       if(this.callbackCompleted[settings.ON_MOUSE_DOWN]) {
        this.callbackCompleted[settings.ON_MOUSE_DOWN]
            .call(this.callbackOwner[settings.ON_MOUSE_DOWN]);
       }
    };
    
    this.buttonOver = (evt) => {
        if (!$.browser.mobile) {
            evt.target.cursor = 'pointer';
        }  
    };
    
    this.setPosition = (iXPos,iYPos) => {
        this.button.x = iXPos;
        this.button.y = iYPos;
    };
    
    this.getButtonImage = () => {
        return this.button;
    };
    
    this.initToggle(xPosition, yPosition, spriteImage, isActive, parentContainer);
}

export default CToggle;