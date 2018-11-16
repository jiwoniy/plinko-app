import $ from 'jquery'

import createjs from './createjs.js'
import {
    createBitmap,
    setVolume,
    s_iScaleFactor,
 } from './ctl_utils.js'
 import {
    mainInstance,
} from './CMain.js'
import CSpriteLibrary from './sprite_lib.js'
import CCell from './CCell.js'
import CBallGenerator from './CBallGenerator.js'
import CInsertTubeController from './CInsertTubeController.js'
import CScoreBasketController from './CScoreBasketController.js'
import CEndPanel from './CEndPanel.js'
import CGridMapping, {
    gridInstance
} from './CGridMapping.js'
import CInterface from './CInterface.js'
import settings from './settings.js'

function CGame(oData) {
    // var _bStartGame;

    var _iColToLaunchBall;
    var _iNumBallRemaining;

    var _aProbability;

    var _oInterface;
    // var _oEndPanel = null;
    // var _oParent;
    var _oBallGenerator;
    var _oInsertTubeController;
    var _oScoreBasketController;
    var _oBgContainer;
    var _oBoardContainer;
    var _oMidContainer;
    var _oForegroundContainer;
    var _aBoard;
    var _oCurBall = null;

    this.state = {
        initData: oData || {},
        endPanel: null
    }
    
    this._init = () => {
        setVolume("soundtrack", 0.3);
        
        // _bStartGame=true;

        _iNumBallRemaining = settings.getNumBall();
        
        var oBg = createBitmap(CSpriteLibrary.getSprite('bg_game'));
        mainInstance().getStage().addChild(oBg);

        const logoGameSprite = CSpriteLibrary.getSprite('logo_game');
        var oLogo = createBitmap(logoGameSprite);
        oLogo.regX = logoGameSprite.width / 2;
        oLogo.regY = logoGameSprite.height / 2;
        oLogo.x = settings.CANVAS_WIDTH / 2;
        oLogo.y = 250;

        _oBgContainer = new createjs.Container();
        mainInstance().getStage().addChild(_oBgContainer);

        _oBoardContainer = new createjs.Container();
        mainInstance().getStage().addChild(_oBoardContainer);

        _oMidContainer = new createjs.Container();
        mainInstance().getStage().addChild(_oMidContainer);

        _oForegroundContainer = new createjs.Container();
        mainInstance().getStage().addChild(_oForegroundContainer);

        this._setBoard();
        settings.NUM_INSERT_TUBE = _aBoard[0].length;

        const sideLeftSprite = CSpriteLibrary.getSprite('side_left');
        const oSideLeft = createBitmap(sideLeftSprite);
        oSideLeft.x = 100;
        _oForegroundContainer.addChild(oSideLeft);

        const sideRightSprite = CSpriteLibrary.getSprite('side_right');
        const oSideRight = createBitmap(sideRightSprite);
        oSideRight.regX = sideRightSprite.width;
        oSideRight.x = settings.CANVAS_WIDTH - 100;
        _oForegroundContainer.addChild(oSideRight);

        settings.BALL_RADIUS = CSpriteLibrary.getSprite('ball').height / 2;
        _oBallGenerator = new CBallGenerator(_oMidContainer);
        
        _oInsertTubeController = new CInsertTubeController(_oMidContainer);

        _oScoreBasketController = new CScoreBasketController(_oBgContainer);

        
        this._initProbability();
        _oInterface = new CInterface(true, _oBgContainer, this);
        _oInsertTubeController.showSlots();

        $(mainInstance()).trigger("start_level",1);
    };
    
    this._setBoard = () => {
        const iRow = settings.BOARD_ROW;
        const iCol = settings.BOARD_COL;
        _aBoard = [];
        for(let i = 0; i < iRow; i += 1) {
            _aBoard[i] = [];
            for(let j = 0; j < iCol - ( (i+1) % 2); j += 1) {
                let iX;
                if(i % 2 === 0) {
                    iX = j * settings.CELL_SIZE;
                } else {
                    iX = -(settings.CELL_SIZE / 2) + (j * settings.CELL_SIZE);
                }
                const iY = i * settings.CELL_SIZE / 2;
                _aBoard[i][j] = new CCell(iX, iY, _oBoardContainer, i, j/*, _oActionContainer*/);
                
                ////REMOVE STAKE
                if(i === settings.BOARD_ROW-1 || (i%2 === 1 && (j===0 || j === settings.BOARD_COL - 1))) {
                    _aBoard[i][j].removeStake();
                }
            }
        }

        _oBoardContainer.regX = (_oBoardContainer.getBounds().x) + _oBoardContainer.getBounds().width/2;
        _oBoardContainer.regY = (_oBoardContainer.getBounds().y) + _oBoardContainer.getBounds().height/2;
        _oBoardContainer.x = settings.CANVAS_WIDTH / 2;
        _oBoardContainer.y = (settings.CANVAS_HEIGHT / 2) - 29;

        new CGridMapping(true, _aBoard);
    };
    
    this._initProbability = () => {
        _aProbability = [];
        for(let i = 0; i < settings.getPrize().length; i += 1) {
            const iProbability = settings.getPrize()[i].win_occurrence;
            for(let j = 0; j < iProbability; j += 1) {
                _aProbability.push(i);
            }            
        }            
    };
    
    this.launch = (iStartCol) => {
        _iColToLaunchBall = iStartCol;
        _iNumBallRemaining -= 1;
        
        this.setBall();
        
        _oInsertTubeController.hideSlots();
        _oBallGenerator.shiftBallAnimation();

        var oDestBall = this.getBallPivotCellPos(0, iStartCol);
        _oCurBall.launchAnim(oDestBall);
        
        _oInterface.refreshBallNum(_iNumBallRemaining);
        _oInterface.hideControls();
    };
    
    this.setBall = () => {
        _oCurBall = _oBallGenerator.getNextBall();

        var oCurBallPos = _oCurBall.getPos();
        var oNewPos = _oBoardContainer.globalToLocal(oCurBallPos.x * s_iScaleFactor, oCurBallPos.y * s_iScaleFactor);

        _oBoardContainer.addChild(_oCurBall.getSprite());
        _oCurBall.setPos(oNewPos);
    };
    
    this.getFallPath = () => {
        var iEndCol = this._setEndCol();
        var aPath = gridInstance().getRandomPathFromColToCol(_iColToLaunchBall,iEndCol);
        
        for(var i=0; i<aPath.length; i++){
            _aBoard[aPath[i].row][aPath[i].col].highlight(true);
        }
        
        var aNewPath = this.getPathCopy(aPath);
        
        _oCurBall.startPathAnim(aNewPath, 500);

        _oCurBall = null;
    };
    
    this.ballArrived = (iDestCol) => {
        // var iPrizeWin = iDestCol;
        var bHasWin = settings.getPrize()[iDestCol].prizewinning;

        $(mainInstance()).trigger("save_score",[iDestCol]);

        _oInsertTubeController.showSlots();
        
        _oInterface.showControls();
        
        _oScoreBasketController.litBasket(iDestCol, bHasWin);
        
        this.checkEndGame(iDestCol, bHasWin);
        
    };
    
    this.checkEndGame = function(iPrizeWin, bHasWin) {
        if (bHasWin) {
            this.gameOver(iPrizeWin, true);
            return; 
        }
        
        if (_iNumBallRemaining === 0) {
            this.gameOver(iPrizeWin, false);
        }
    };
    
   
    this._setEndCol = () => {
        //DETECT ALL POSSIBLE PRIZE LOWER THEN BANK
        var iPrizeToChoose = _aProbability[Math.floor(Math.random()*_aProbability.length)];      

        return iPrizeToChoose;
    };
    
    this.getBall = () => {
        return _oCurBall;
    };
    
    this.getBoard = () => {
        return _aBoard;
    };
    
    this.getBallPivotCellPos = (iRow, iCol) => {
        return _aBoard[iRow][iCol].getCenterOfBallOnPivot();
    };
    
    this.getPathCopy = (aPath) => {
        const aNewPath = [];
        for(let i = 0; i < aPath.length; i += 1) {
            aNewPath.push(aPath[i])
        }
        
        return aNewPath;
    };
   
    this.restartGame = () => {
        $(mainInstance()).trigger("show_interlevel_ad");
        _oInterface.showControls();
    };        
    
    this.unload = () => {
        // _bStartGame = false;
        
        _oInterface.unload();
        
        _oScoreBasketController.unload();
        
        createjs.Tween.removeAllTweens();
        mainInstance().getStage().removeAllChildren();
    };
 
    this.onExit = () => {
        setVolume("soundtrack", 1);
        
        $(this).trigger("end_session");
        $(this).trigger("end_level",1);
        
        this.unload();
        mainInstance().gotoMenu();
    };
    
    this._onExitHelp = () => {
        //  _bStartGame = true;
    };
    
    this.gameOver = (iPrizeWin, bHasWin) => {
        _oInterface.hideControls();
        this.state.endPanel = new CEndPanel(iPrizeWin, bHasWin);
    };

    this.getSlotPosition = (iIndex) => {
        return _oInsertTubeController.getSlotPos(iIndex);
    };
    
    
    this.sortChildren = (obj1, obj2, options) => {
       if (obj1.y < obj2.y) { return 1; }
       if (obj1.y > obj2.y) { return -1; }
       return 0;
   };
    
    this.update = () => {
        _oBoardContainer.sortChildren(this.sortChildren);
    };

    // s_oGame=this;
    settings.setNumBall(this.state.initData.num_ball)
    settings.setPrize(this.state.initData.prize_settings)
    settings.setAdShowCounter(this.state.initData.ad_show_counter)
    // settings.PRIZE = o;
    // settings.AD_SHOW_COUNTER = oData.ad_show_counter;
    // _oParent=this;
    this._init();
}


const Singleton = (() => {
    let instance = null;
    function createInstance(data) {
        return new CGame(data);
    }
  
    return {
      getInstance: (isConstructor = false, data) => {
        if (isConstructor) {
            instance = createInstance(data);
        }
        return instance;
      },
    };
})();
const gameInstance = () => Singleton.getInstance(false)

// Need Instance & constructor
export default Singleton.getInstance;
export {
    gameInstance
}

// var s_oGame;
