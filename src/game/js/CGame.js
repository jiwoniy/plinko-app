function CGame(oData){
    var _bStartGame;

    var _iColToLaunchBall;
    var _iNumBallRemaining;

    var _aProbability;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oBallGenerator;
    var _oInsertTubeController;
    var _oScoreBasketController;
    var _oBgContainer;
    var _oBoardContainer;
    var _oMidContainer;
    var _oForegroundContainer;
    var _aBoard;
    var _oCurBall = null;
    
    this._init = function(){
        
        setVolume("soundtrack", 0.3);
        
        _bStartGame=true;

        _iNumBallRemaining = NUM_BALL;
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg);

        var oSprite = s_oSpriteLibrary.getSprite('logo_game');
        var oLogo = createBitmap(oSprite);
        oLogo.regX = oSprite.width/2;
        oLogo.regY = oSprite.height/2;
        oLogo.x = CANVAS_WIDTH/2;
        oLogo.y = 250;

        _oBgContainer = new createjs.Container();
        s_oStage.addChild(_oBgContainer);

        _oBoardContainer = new createjs.Container();
        s_oStage.addChild(_oBoardContainer);

        _oMidContainer = new createjs.Container();
        s_oStage.addChild(_oMidContainer);

        _oForegroundContainer = new createjs.Container();
        s_oStage.addChild(_oForegroundContainer);

        this._setBoard();
        NUM_INSERT_TUBE = _aBoard[0].length;

        var oSprite = s_oSpriteLibrary.getSprite('side_left');
        var oSideLeft = createBitmap(oSprite);
        oSideLeft.x = 100;
        _oForegroundContainer.addChild(oSideLeft);

        var oSprite = s_oSpriteLibrary.getSprite('side_right');
        var oSideRight = createBitmap(oSprite);
        oSideRight.regX = oSprite.width;
        oSideRight.x = CANVAS_WIDTH-100;
        _oForegroundContainer.addChild(oSideRight);

        BALL_RADIUS = s_oSpriteLibrary.getSprite('ball').height/2;
        _oBallGenerator = new CBallGenerator(_oMidContainer);
        
        _oInsertTubeController = new CInsertTubeController(_oMidContainer);

        _oScoreBasketController = new CScoreBasketController(_oBgContainer);

        
        this._initProbability();


        _oInterface = new CInterface(_oBgContainer);

        _oInsertTubeController.showSlots();

        $(s_oMain).trigger("start_level",1);

    };
    
    this._setBoard = function(){
        var iRow = BOARD_ROW;
        var iCol = BOARD_COL;
        _aBoard = new Array();
        for(var i=0; i<iRow; i++){
            _aBoard[i] = new Array();
            for(var j=0; j<iCol-((i+1)%2); j++){
                var iX;
                if(i%2 === 0){
                    iX = j*CELL_SIZE;
                } else {
                    iX = -CELL_SIZE/2 +j*CELL_SIZE;
                }
                var iY = i*CELL_SIZE/2;
                _aBoard[i][j] = new CCell(iX, iY, _oBoardContainer, i, j/*, _oActionContainer*/);
                
                ////REMOVE STAKE
                if(i === BOARD_ROW-1 || (i%2 === 1 && (j===0 || j === BOARD_COL-1) )){
                    _aBoard[i][j].removeStake();
                }
            }
        }

        _oBoardContainer.regX = (_oBoardContainer.getBounds().x) + _oBoardContainer.getBounds().width/2;
        _oBoardContainer.regY = (_oBoardContainer.getBounds().y) + _oBoardContainer.getBounds().height/2;
        _oBoardContainer.x = CANVAS_WIDTH/2;
        _oBoardContainer.y = CANVAS_HEIGHT/2-29;

        new CGridMapping(_aBoard);
    };
    
    this._initProbability = function(){
        _aProbability = new Array();
        for(var i=0; i<PRIZE.length; i++){
            var iProbability = PRIZE[i].win_occurrence;
            for(var j=0; j<iProbability; j++){
                _aProbability.push(i);
            }            
        }            
    };
    
    this.launch = function(iStartCol){
        _iColToLaunchBall = iStartCol;
        _iNumBallRemaining--;
        
        this.setBall();
        
        _oInsertTubeController.hideSlots();
        _oBallGenerator.shiftBallAnimation();

        var oDestBall = s_oGame.getBallPivotCellPos(0, iStartCol);
        _oCurBall.launchAnim(oDestBall);
        
        _oInterface.refreshBallNum(_iNumBallRemaining);
        _oInterface.hideControls();
    };
    
    this.setBall = function(){
        _oCurBall = _oBallGenerator.getNextBall();

        var oCurBallPos = _oCurBall.getPos();
        var oNewPos = _oBoardContainer.globalToLocal(oCurBallPos.x*s_iScaleFactor, oCurBallPos.y*s_iScaleFactor);

        _oBoardContainer.addChild(_oCurBall.getSprite());
        _oCurBall.setPos(oNewPos);
    };
    
    this.getFallPath = function(){
        var iEndCol = this._setEndCol();
        var aPath = s_oGridMapping.getRandomPathFromColToCol(_iColToLaunchBall,iEndCol);
        
        for(var i=0; i<aPath.length; i++){
            _aBoard[aPath[i].row][aPath[i].col].highlight(true);
        }
        
        var aNewPath = this.getPathCopy(aPath);
        
        _oCurBall.startPathAnim(aNewPath, 500);

        _oCurBall = null;
    };
    
    this.ballArrived = function(iDestCol){

        var iPrizeWin = iDestCol;
        var bHasWin = PRIZE[iDestCol].prizewinning;

        $(s_oMain).trigger("save_score",[iPrizeWin]);

        _oInsertTubeController.showSlots();
        
        _oInterface.showControls();
        
        _oScoreBasketController.litBasket(iDestCol, bHasWin);
        
        this.checkEndGame(iPrizeWin, bHasWin);
        
    };
    
    this.checkEndGame = function(iPrizeWin, bHasWin){
        if(bHasWin){
            this.gameOver(iPrizeWin, true);
            return; 
        }
        
        if(_iNumBallRemaining === 0){
            this.gameOver(iPrizeWin, false);
        }
    };
    
   
    this._setEndCol = function(){
        //DETECT ALL POSSIBLE PRIZE LOWER THEN BANK
        var iPrizeToChoose = _aProbability[Math.floor(Math.random()*_aProbability.length)];      

        return iPrizeToChoose;
    };
    
    this.getBall = function(){
        return _oCurBall;
    };
    
    this.getBoard = function(){
        return _aBoard;
    };
    
    this.getBallPivotCellPos = function(iRow, iCol){
        return _aBoard[iRow][iCol].getCenterOfBallOnPivot();
    };
    
    this.getPathCopy = function(aPath){
        var aNewPath = new Array();
        for(var i=0; i<aPath.length; i++){
            aNewPath.push(aPath[i])
        }
        
        return aNewPath;
    };
   
    this.restartGame = function () {
        $(s_oMain).trigger("show_interlevel_ad");

        _oInterface.showControls();
    };        
    
    this.unload = function(){
        _bStartGame = false;
        
        _oInterface.unload();
        
        _oScoreBasketController.unload();
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };
 
    this.onExit = function(){
        setVolume("soundtrack", 1);
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("end_level",1);
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
         
    };
    
    this.gameOver = function(iPrizeWin, bHasWin){
        _oInterface.hideControls();
        _oEndPanel = new CEndPanel(iPrizeWin, bHasWin);
    };

    this.getSlotPosition = function(iIndex){
        return _oInsertTubeController.getSlotPos(iIndex);
    };
    
    
    this.sortChildren = function(obj1, obj2, options) {
       if (obj1.y < obj2.y) { return 1; }
       if (obj1.y > obj2.y) { return -1; }
       return 0;
   };
    
    this.update = function(){
        _oBoardContainer.sortChildren(this.sortChildren);
    };

    s_oGame=this;
    
    NUM_BALL = oData.num_ball;

    PRIZE = oData.prize_settings;
    
    AD_SHOW_COUNTER = oData.ad_show_counter;
    
    _oParent=this;
    this._init();
}

var s_oGame;
