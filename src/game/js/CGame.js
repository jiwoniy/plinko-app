import $ from 'jquery'

import createjs from './createjs.js'
import {
    createBitmap,
    setVolume,
    s_iScaleFactor,
 } from './ctl_utils.js'

import CGridMapping from './CGridMapping.js'
import CSpriteLibrary from './sprite_lib.js'
import CCell from './CCell.js'
import CBallGenerator from './CBallGenerator.js'
import CInsertTubeController from './CInsertTubeController.js'
import CScoreBasketController from './CScoreBasketController.js'
import CEndPanel from './CEndPanel.js'
import CInterface from './CInterface.js'
import settings from './settings.js'

function CGame(oData, mainInstance) {
    // var _bStartGame;

    // var _iColToLaunchBall;
    var _iNumBallRemaining;

    // this _aProbability;

    // var _oInterface;
    // var _oEndPanel = null;
    // var _oParent;
    // var _oBallGenerator;
    // var _oInsertTubeController;
    // var _oScoreBasketController;
    // var _oBgContainer;
    // var _oBoardContainer;
    // var _oMidContainer;
    // var _oForegroundContainer;
    // var _aBoard;
    // var _oCurBall = null;

    this.mainInstance = mainInstance
    this.interfaceInstance = null
    this.insertTubeController = null
    this.ballGenerator = null
    this.scoreBasketController = null
    this.gridInstance = null
    this.backgroundContainer = null
    this.midContainer = null

    this.state = {
        board: [],
        initData: oData || {},
        endPanel: null,
        _aProbability: [],
        currentBall: null,
        currentBallIndex: null
    }
    
    this.initGame = () => {
        setVolume('soundtrack', 0.3);
        
        // _bStartGame=true;
        _iNumBallRemaining = settings.getNumBall();
        
        const gameBackground = createBitmap(CSpriteLibrary.getSprite('bg_game'));
        this.mainInstance.getStage().addChild(gameBackground);
        
        // const tabelTennisSprite = createBitmap(CSpriteLibrary.getSprite('table_tennis'))
        // this.mainInstance.getStage().addChild(tabelTennisSprite);
        
        // const logoGameSprite = CSpriteLibrary.getSprite('logo_game');
        // const oLogo = createBitmap(logoGameSprite);
        // oLogo.regX = logoGameSprite.width / 2;
        // oLogo.regY = logoGameSprite.height / 2;
        // oLogo.x = settings.getCanvasWidth() / 2;
        // oLogo.y = 250;

        this.backgroundContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(this.backgroundContainer);

        this.boardContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(this.boardContainer);

        this.midContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(this.midContainer);

        const foregroundContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(foregroundContainer);

        // const sideLeftSprite = CSpriteLibrary.getSprite('side_left');
        // const oSideLeft = createBitmap(sideLeftSprite);
        // oSideLeft.x = 120;
        // oSideLeft.y = 120;
        // foregroundContainer.addChild(oSideLeft);

        // const sideRightSprite = CSpriteLibrary.getSprite('side_right');
        // const oSideRight = createBitmap(sideRightSprite);
        // oSideRight.regX = sideRightSprite.width;
        // oSideRight.x = settings.getCanvasWidth() - 100;
        // oSideRight.y = 120;
        // foregroundContainer.addChild(oSideRight);
        this.setBoard();

        settings.setBallRadius(CSpriteLibrary.getSprite('ball').height / 2)
        this.ballGenerator = new CBallGenerator(this.midContainer);
        this.insertTubeController = new CInsertTubeController(this.midContainer);
        this.scoreBasketController = new CScoreBasketController(this.backgroundContainer);
        
        this.initProbability();
        this.interfaceInstance = new CInterface(true, this.backgroundContainer, this);
        this.insertTubeController.showSlots();

        $(this.mainInstance).trigger("start_level", 1);
    };
    
    this.setBoard = () => {
        const allRow = settings.getMatrixRow(); // 13
        const allCol = settings.getMatrixCol(); // 7

        for(let currentRow = 0; currentRow < allRow; currentRow += 1) {
            // row
            this.state.board[currentRow] = [];
            // even - 6
            // odd - 7
            for (let currentCol = 0; currentCol < allCol - ((currentRow + 1) % 2); currentCol += 1) {
                let xPosition;
                if (currentRow % 2 === 0) {
                    xPosition = currentCol * settings.getCellSize();
                } else {
                    xPosition = - (settings.getCellSize() / 2) + (currentCol * settings.getCellSize());
                }
                const yPosition = currentRow * settings.getCellSize() / 2;
                this.state.board[currentRow][currentCol] = new CCell(xPosition,
                    yPosition, this.boardContainer, currentRow, currentCol/*, _oActionContainer*/);
                
                // remove stake
                // if(i === settings.getMatrixRow() - 1 || (i % 2 === 1 && (j===0 || j === settings.getMatrixCol() - 1))) {
                //     this.state.board[i][j].removeStake();
                // }
            }
        }

        settings.setInsertTubeNumber(this.state.board[0].length)

        // this.boardContainer.setBounds(-82, 60, 864, 902)
        // console.log(this.boardContainer.getBounds())
    
        this.boardContainer.regX = (this.boardContainer.getBounds().x) + this.boardContainer.getBounds().width / 2;
        this.boardContainer.regY = (this.boardContainer.getBounds().y) + this.boardContainer.getBounds().height / 2;
        this.boardContainer.x = settings.getCanvasWidth() / 2;
        this.boardContainer.y = (settings.getCanvasHeight() / 2) - 29;

        // const tabelTennisSprite = createBitmap(CSpriteLibrary.getSprite('table_tennis'))
        // // tabelTennisSprite.regX = (this.boardContainer.getBounds().x) + this.boardContainer.getBounds().width / 2;
        // // tabelTennisSprite.regY = (this.boardContainer.getBounds().y) + this.boardContainer.getBounds().height / 2;
        // tabelTennisSprite.x = settings.getCanvasWidth() / 2;
        // tabelTennisSprite.y = (settings.getCanvasHeight() / 2) - 29;
        // this.mainInstance.getStage().addChild(tabelTennisSprite);

        this.gridInstance = new CGridMapping(true, this.state.board);
    };
    
    this.initProbability = () => {
        this.state._aProbability = [];
        for (let i = 0; i < settings.getPrize().length; i += 1) {
            const iProbability = settings.getPrize()[i].win_occurrence;
            for (let j = 0; j < iProbability; j += 1) {
                this.state._aProbability.push(i);
            }            
        }
    };
    
    this.launch = (startIndex) => {
        this.state.currentBallIndex = startIndex;
        _iNumBallRemaining -= 1;
        
        this.setBall();
        
        this.insertTubeController.hideSlots();
        this.ballGenerator.shiftBallAnimation();

        var oDestBall = this.getBallPivotCellPos(0, startIndex);
        this.state.currentBall.launchAnim(oDestBall);
        
        this.interfaceInstance.refreshBallNum(_iNumBallRemaining);
        this.interfaceInstance.hideControls();
    };

    this.setCurrentBall = (ball) => {
        this.state.currentBall = ball;
    }
    
    this.setBall = () => {
        this.setCurrentBall(this.ballGenerator.getNextBall())
        // this.state.currentBall = this.ballGenerator.getNextBall();

        const oCurBallPos = this.state.currentBall.getPos();
        const oNewPos = this.boardContainer.globalToLocal(oCurBallPos.x * s_iScaleFactor, oCurBallPos.y * s_iScaleFactor);

        this.boardContainer.addChild(this.state.currentBall.getSprite());
        this.state.currentBall.setPos(oNewPos);
    };
    
    this.getFallPath = () => {
        const destIndex = this.setDestination();
        const ballPaths = this.gridInstance.getRandomPathFrom(this.state.currentBallIndex, destIndex);
        
        for (let i = 0; i < ballPaths.length; i += 1) {
            this.state.board[ballPaths[i].row][ballPaths[i].col].highlight(true);
        }
        
        const aNewPath = this.getPathCopy(ballPaths);
        this.state.currentBall.startPathAnim(aNewPath, 500);

        this.setCurrentBall(null)
    };
    
    this.ballArrived = (iDestCol) => {
        // var iPrizeWin = iDestCol;
        const bHasWin = settings.getPrize()[iDestCol].prizewinning;

        $(this.mainInstance).trigger("save_score",[iDestCol]);

        this.insertTubeController.showSlots();
        this.interfaceInstance.showControls();
        this.scoreBasketController.litBasket(iDestCol, bHasWin);
        
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
    
   
    this.setDestination = () => {
        // TODO connect with server
        const iPrizeToChoose = this.state._aProbability[Math.floor(Math.random() * this.state._aProbability.length)];      
        return iPrizeToChoose;
    };
    
    // this.getBall = () => {
    //     return _oCurBall;
    // };
    
    this.getBoard = () => {
        return this.state.board;
    };
    
    this.getBallPivotCellPos = (iRow, iCol) => {
        return this.state.board[iRow][iCol].getCenterOfBallOnPivot();
    };
    
    this.getPathCopy = (aPath) => {
        const aNewPath = [];
        for(let i = 0; i < aPath.length; i += 1) {
            aNewPath.push(aPath[i])
        }
        
        return aNewPath;
    };
   
    this.restartGame = () => {
        $(this.mainInstance).trigger("show_interlevel_ad");
        this.interfaceInstance.showControls();
    };        
    
    this.unload = () => {
        // _bStartGame = false;
        this.interfaceInstance.unload();
        this.scoreBasketController.unload();
        
        createjs.Tween.removeAllTweens();
        this.mainInstance.getStage().removeAllChildren();
    };
 
    this.onExit = () => {
        setVolume('soundtrack', 1);
        
        $(this).trigger('end_session');
        $(this).trigger('end_level', 1);
        
        this.unload();
        this.mainInstance.gotoMenu();
    };
    
    this._onExitHelp = () => {
        //  _bStartGame = true;
    };
    
    this.gameOver = (iPrizeWin, bHasWin) => {
        this.interfaceInstance.hideControls();
        this.state.endPanel = new CEndPanel(iPrizeWin, bHasWin);
    };

    this.getSlotPosition = (iIndex) => {
        return this.insertTubeController.getSlotPos(iIndex);
    };
    
    this.sortChildren = (obj1, obj2, options) => {
       if (obj1.y < obj2.y) { return 1; }
       if (obj1.y > obj2.y) { return -1; }
       return 0;
   };
    
    this.update = () => {
        this.boardContainer.sortChildren(this.sortChildren);
    };

    // s_oGame=this;
    settings.setNumBall(this.state.initData.num_ball)
    settings.setPrize(this.state.initData.prize_settings)
    // settings.setAdShowCounter(this.state.initData.ad_show_counter)
    // settings.PRIZE = o;
    // settings.AD_SHOW_COUNTER = oData.ad_show_counter;
    // _oParent=this;
    this.initGame();
}

const Singleton = (() => {
    let instance = null;
    function createInstance(data, mainInstance) {
        return new CGame(data, mainInstance);
    }
  
    return {
      getInstance: (isConstructor = false, data, mainInstance) => {
        if (isConstructor) {
            instance = createInstance(data, mainInstance);
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
