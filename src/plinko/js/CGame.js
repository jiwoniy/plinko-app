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
        ballCount: 0,
        initData: oData || {},
        endPanel: null,
        probability: [],
        currentBall: null,
        currentBallIndex: null
    }
    
    this.initGame = () => {
        setVolume('soundtrack', 0.3);
        
        // _bStartGame=true;
        this.state.ballCount = settings.getNumBall();
        
        const gameBackground = createBitmap(CSpriteLibrary.getImage('bg_game'));
        this.mainInstance.getStage().addChild(gameBackground);

        this.backgroundContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(this.backgroundContainer);

        this.boardContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(this.boardContainer);

        this.midContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(this.midContainer);

        const foregroundContainer = new createjs.Container();
        this.mainInstance.getStage().addChild(foregroundContainer);

        this.setBoard();

        const ballSprite = CSpriteLibrary.getImage('ball');
        settings.setBallRadius(settings.getDeviceWidthRatio(ballSprite.width) / 2)

        this.ballGenerator = new CBallGenerator(this.midContainer);
        this.insertTubeController = new CInsertTubeController(this.midContainer);
        this.scoreBasketController = new CScoreBasketController(this.backgroundContainer);
        
        this.initProbability();
        this.interfaceInstance = new CInterface(true, this.backgroundContainer, this);
        this.insertTubeController.showSlots();

        $(this.mainInstance).trigger('start_level', 1);
    };
    
    this.setBoard = () => {
        const allRow = settings.getMatrixRow(); // 13
        const allCol = settings.getMatrixCol(); // 7

        const widthGap = settings.getCellGapSize() * 1.3
        const heightGap = settings.getCellGapSize()

        for (let currentRow = 0; currentRow < allRow; currentRow += 1) {
            // row
            this.state.board[currentRow] = [];
            // even - 6
            // odd - 7
            for (let currentCol = 0; currentCol < allCol - ((currentRow + 1) % 2); currentCol += 1) {
                let xPosition;
                if (currentRow % 2 === 0) {
                    xPosition = + (widthGap / 2) + (currentCol * widthGap);
                } else {
                    xPosition = currentCol * widthGap;
                }
                const yPosition = currentRow * heightGap;
                this.state.board[currentRow][currentCol] = new CCell(xPosition,
                    yPosition, this.boardContainer, currentRow, currentCol/*, _oActionContainer*/);
                
                // remove stake // ㅁㅏ지막 애니메이션 및 자연스러움을 위해 지운듯...
                if(currentRow === settings.getMatrixRow() - 1) {
                    this.state.board[currentRow][currentCol].removeStake();
                }
            }
        }

        settings.setInsertTubeNumber(this.state.board[0].length)
        // this.boardContainer.x = settings.get10PercentWidth()
        // this.boardContainer.x = settings.getCanvasWidth() / 2 - (this.boardContainer.getBounds().width / 2)
        this.boardContainer.x = settings.getCanvasWidth() / 2 - (allCol * widthGap / 2)
        this.boardContainer.y =  settings.getCanvasHeight() / 2 - (allRow * heightGap / 2);
        // const tabelTennisSprite = createBitmap(CSpriteLibrary.getImage('table_tennis'))
        // // tabelTennisSprite.regX = (this.boardContainer.getBounds().x) + this.boardContainer.getBounds().width / 2;
        // // tabelTennisSprite.regY = (this.boardContainer.getBounds().y) + this.boardContainer.getBounds().height / 2;
        // tabelTennisSprite.x = settings.getCanvasWidth() / 2;
        // tabelTennisSprite.y = (settings.getCanvasHeight() / 2) - 29;
        // this.mainInstance.getStage().addChild(tabelTennisSprite);

        this.gridInstance = new CGridMapping(true, this.state.board);
    };
    
    this.initProbability = () => {
        this.state.probability = [];
        for (let i = 0; i < settings.getPrize().length; i += 1) {
            const iProbability = settings.getPrize()[i].win_occurrence;
            for (let j = 0; j < iProbability; j += 1) {
                this.state.probability.push(i);
            }            
        }
    };
    
    this.launch = (startCol) => {
        this.state.currentBallIndex = startCol;
        this.state.ballCount -= 1;
        
        this.setBall();
        this.insertTubeController.hideSlots();
        this.ballGenerator.shiftBallAnimation();

        const startCellPoint = this.getBallPosition(0, startCol);
        this.state.currentBall.launchAnim(startCellPoint);
        
        this.interfaceInstance.refreshBallNum(this.state.ballCount);
        // this.interfaceInstance.hideControls();
    };

    this.setCurrentBall = (ball) => {
        this.state.currentBall = ball;
    }
    
    this.setBall = () => {
        this.setCurrentBall(this.ballGenerator.getNextBall())
        // this.state.currentBall = this.ballGenerator.getNextBall();

        const startBallPos = this.state.currentBall.getPos();
        const movePos = this.boardContainer.globalToLocal(
            startBallPos.x * s_iScaleFactor,
            startBallPos.y * s_iScaleFactor);

        this.boardContainer.addChild(this.state.currentBall.getImage());
        this.state.currentBall.setPos(movePos);
    };
    
    this.getFallPath = () => {
        const destIndex = this.setDestination();
        const ballPaths = this.gridInstance.getRandomPathFrom(this.state.currentBallIndex, destIndex);
        
        for (let i = 0; i < ballPaths.length; i += 1) {
            this.state.board[ballPaths[i].row][ballPaths[i].col].highlight(true);
        }
        
        this.state.currentBall.startPathAnim(this.getPathCopy(ballPaths), 500);

        this.setCurrentBall(null)
    };
    
    this.ballArrived = (iDestCol) => {
        // var iPrizeWin = iDestCol;
        const bHasWin = settings.getPrize()[iDestCol].prizewinning;

        $(this.mainInstance).trigger("save_score",[iDestCol]);

        this.insertTubeController.showSlots();
        // this.interfaceInstance.showControls();
        this.scoreBasketController.litBasket(iDestCol, bHasWin);
        
        this.checkEndGame(iDestCol, bHasWin);
    };
    
    this.checkEndGame = function(iPrizeWin, bHasWin) {
        // if (bHasWin) {
        //     this.gameOver(iPrizeWin, true);
        //     return; 
        // }
        
        // if (this.state.ballCount === 0) {
        //     this.gameOver(iPrizeWin, false);
        // }
    };
    
   
    this.setDestination = () => {
        // TODO connect with server
        const iPrizeToChoose = this.state.probability[Math.floor(Math.random() * this.state.probability.length)];      
        return iPrizeToChoose;
    };
    
    // this.getBall = () => {
    //     return _oCurBall;
    // };
    
    this.getBoard = () => {
        return this.state.board;
    };
    
    this.getBallPosition = (row, col) => {
        return this.state.board[row][col].getCellPosition();
    };
    
    this.getPathCopy = (path) => {
        const returnPath = [];
        for(let i = 0; i < path.length; i += 1) {
            returnPath.push(path[i])
        }
        
        return returnPath;
    };
   
    this.restartGame = () => {
        $(this.mainInstance).trigger("show_interlevel_ad");
        // this.interfaceInstance.showControls();
    };        
    
    this.unload = () => {
        // _bStartGame = false;
        this.interfaceInstance.unload();
        this.scoreBasketController.unload();
        //
        this.boardContainer.removeAllChildren()
        
        createjs.Tween.removeAllTweens();
        this.mainInstance.getStage().removeAllChildren();
    };
 
    this.onExit = () => {
        setVolume('soundtrack', 1);
        
        $(this).trigger('end_session');
        $(this).trigger('end_level', 1);
        
        this.unload();
        // this.mainInstance.gotoMenu();
        this.mainInstance.gotoGame();
    };
    
    // this._onExitHelp = () => {
    //     //  _bStartGame = true;
    // };
    
    this.gameOver = (iPrizeWin, bHasWin) => {
        // this.interfaceInstance.hideControls();
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
