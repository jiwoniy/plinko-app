import settings from './settings.js'

var DIR_TOPRIGHT = "DIR_TOPRIGHT";
var DIR_BOTRIGHT = "DIR_BOTRIGHT";
var DIR_TOPLEFT = "DIR_TOPLEFT";
var DIR_BOTLEFT = "DIR_BOTLEFT";
var DIR_SELF = "DIR_SELF";

function CGridMapping(aMatrix) {
    var _iRow;
    var _iCol;
    
    var _aMatrixMap;
    var _aRadiusMap;
    
    var _aPrecomputedStartPath;
    
    this._init = (aMatrix) => {
        _iRow = settings.BOARD_ROW;
        _iCol = settings.BOARD_COL;
        
        _aRadiusMap = [];
        
        _aMatrixMap = [];
        for(let i = 0; i < aMatrix.length; i += 1) {
            _aMatrixMap[i] = [];
            for(let j = 0; j < aMatrix[i].length; j += 1) {
                _aMatrixMap[i][j] = [];
            }
        }
        
        this._buildMap();
        _aPrecomputedStartPath = [];
        for(let i = 0; i < aMatrix[0].length; i += 1) {
            _aPrecomputedStartPath[i] = this.getAllPathFrom({row:0, col:i});
        }
    };
    
    this._buildMap = () => {
        for(let i = 0; i < aMatrix.length; i += 1) {
            for(let j = 0; j < aMatrix[i].length; j += 1) {
                _aMatrixMap[i][j][DIR_BOTRIGHT] = this._setNeighbor(i,j,DIR_BOTRIGHT);
                _aMatrixMap[i][j][DIR_BOTLEFT] = this._setNeighbor(i,j,DIR_BOTLEFT);
                _aMatrixMap[i][j][DIR_SELF] = this._setNeighbor(i,j,DIR_SELF);

            }
        }
        
    };
    
    this._setNeighbor = (r, c, iDir) => {
        var oNextDir = null;
        switch(iDir){
            ////r%2 IS USED TO DETECT INDEX COLUMN FOR AN "ODD-ROW" HORIZONTAL LAYOUT HEX GRID. FOR EXAMPLE, IF ROW IS ODD, THE TOPRIGHT NEIGHBOR IS = COL+1. IF ROW IS EVEN, THE TOPRIGHT NEIGHBOR IS = COL. 
            case DIR_TOPRIGHT: {
                if(r>0 && c<_iCol-r%2){
                    oNextDir = {row: r-1, col: c+((r+1)%2)};
                }
                break;
            }
            case DIR_BOTRIGHT:{
                if(r<_iRow-1 && c + r%2<_iCol){
                    oNextDir = {row: r+1, col: c+((r+1)%2)};
                }
                break;
            }
            case DIR_TOPLEFT:{
                if(r>0 && c-(r-1)%2 >= 0){
                    oNextDir = {row: r-1, col: c-((r+1)%2)};
                }
                break;
            }
            case DIR_BOTLEFT:{
                if(r<_iRow-1 && c >= r%2){
                    oNextDir = {row: r+1, col: c-(r%2)};
                }
                break;
            } 
            case DIR_SELF:{
                oNextDir = {row: r, col: c};
                break;
            }
            default:
                break;
        }
        
        return oNextDir;
    };
    
    this._getNeighborByDir = (iRow, iCol, iDir) => {
        return _aMatrixMap[iRow][iCol][iDir];
    };
    
    this._getAllNeighbor = (iRow, iCol) => {
        const aNeighborList = [];
        
        for (let key in _aMatrixMap[iRow][iCol]) {
            if(_aMatrixMap[iRow][iCol][key]!== null){
                aNeighborList.push(_aMatrixMap[iRow][iCol][key]);
            }
        }
        
        return aNeighborList;
    };
    
    this._getMainDiagonal = (iRow, iCol, aBoard) => {
        var aList = [];
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_BOTRIGHT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPLEFT, aList, 99, szColor, aBoard);
        
        return aList;
    };
    
    this._getSecondDiagonal = (iRow, iCol, aBoard) => {
        var aList = [];
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_BOTLEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPRIGHT, aList, 99, szColor, aBoard);

        return aList;
    };
    
    // this._getRow = function(iRow, iCol, aBoard){
    //     var aList = [];
        
    //     var szColor = aBoard[iRow][iCol].getColor();
        
    //     this._findInDirection(iRow, iCol, DIR_LEFT, aList, 99, szColor, aBoard);
    //     this._findInDirection(iRow, iCol, DIR_RIGHT, aList, 99, szColor, aBoard);
        
    //     return aList;
    // };
    
    // this._getCol = function(iRow, iCol, aBoard){
    //     var aList = new Array();
        
    //     var szColor = aBoard[iRow][iCol].getColor();
        
    //     this._findInDirection(iRow, iCol, DIR_TOP, aList, 99, szColor, aBoard);
    //     this._findInDirection(iRow, iCol, DIR_BOT, aList, 99, szColor, aBoard);
        
    //     return aList;
    // };
    
    this._getStraightByDirAndRadius = function(iRow, iCol, szDir, iRadius, aBoard){
        var aList = [];
        _aRadiusMap = [];

        _aRadiusMap.push({radius:iRadius, direction: null});
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, szDir, aList, iRadius, szColor, aBoard);

        
        return aList;
    };
    
    // this._getStraightRowByRadius = function(iRow, iCol, iRadius){
    //     var aList = new Array();
    //     _aRadiusMap = new Array();
        
    //     _aRadiusMap.push({radius:iRadius, direction: null});
        
    //     this._findInDirection(iRow, iCol, DIR_LEFT, aList, iRadius);
    //     this._findInDirection(iRow, iCol, DIR_RIGHT, aList, iRadius);
        
    //     return aList;
    // };
    
    // this._getStraightColByRadius = function(iRow, iCol, iRadius){
    //     var aList = new Array();
    //     _aRadiusMap = new Array();
        
    //     _aRadiusMap.push({radius:iRadius, direction: null});
        
    //     this._findInDirection(iRow, iCol, DIR_TOP, aList, iRadius);
    //     this._findInDirection(iRow, iCol, DIR_BOT, aList, iRadius);
        
        
    //     return aList;
    // };
    
    this._findInDirection = function(iRow, iCol, iDir, aList, iRadius, szColor, aBoard){

        var iCountRadius = iRadius-1;
        
        if(_aMatrixMap[iRow][iCol][iDir] !== null && iCountRadius>=0){
            var iNextRow = _aMatrixMap[iRow][iCol][iDir].row;
            var iNextCol = _aMatrixMap[iRow][iCol][iDir].col;

            if(szColor){
                var szNextColor = aBoard[iNextRow][iNextCol].getColor();
                if(szNextColor === szColor){
                    return;
                }else if (szNextColor === null){
                    aList.push({row: iNextRow, col: iNextCol});
                    _aRadiusMap.push({radius:iCountRadius, direction: iDir});

                    this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
                } else {
                    aList.push({row: iNextRow, col: iNextCol});
                    _aRadiusMap.push({radius:iCountRadius, direction: iDir});
                }
            } else {
                aList.push({row: iNextRow, col: iNextCol});
                _aRadiusMap.push({radius:iCountRadius, direction: iDir});

                this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
            }
        }
    };

    this.getAllPathFrom = function(oPos){
        return this._findAllPathDFS(_aMatrixMap[oPos.row][oPos.col], [], []);
    };

    this.getRandomPathFrom = (oPos) => {
        var aAllPath = this.getAllPathFrom(oPos);
        
        let aRandomPath = [];
        if(aAllPath.length > 0){
            var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
            aRandomPath = aAllPath[iRandomIndex];
        }

        return aRandomPath;
    };

    //////WITHOUT STOP TO DEST NODE
    this.getAllPathFromTo = (oStartPos, oEndPos) => {
        var aAllPath = this.getAllPathFrom(oStartPos);
        
        for(var i=aAllPath.length-1; i>=0; i--){
            var bNodeFound = false;
            for(var j=0; j<aAllPath[i].length; j++){
                if(aAllPath[i][j].row === oEndPos.row && aAllPath[i][j].col === oEndPos.col){
                    bNodeFound = true;
                    break;
                }
            }
            if(!bNodeFound){
                aAllPath.splice(i,1);
            }
        }

        return aAllPath;
    };

    //////WITHOUT STOP TO DEST NODE
    this.getRandomPathFromTo = (oStartPos, oEndPos) => {
        var aAllPath = this.getAllPathFromTo(oStartPos, oEndPos);
        
        let aRandomPath = [];
        if(aAllPath.length > 0){
            var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
            aRandomPath = aAllPath[iRandomIndex];
        }

        return aRandomPath;
    };

    this.getRandomPathFromCol = function(iCol){
        var aAllPath = _aPrecomputedStartPath[iCol];
        
        var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
        var aRandomPath = aAllPath[iRandomIndex];

        return aRandomPath;
    };
    
    this.getRandomPathFromColToCol = function(iStartCol, iEndCol){        
        var aAllPath = [];
        var iLastIndex = _aMatrixMap.length-1;
        
        for(var i=0; i<_aPrecomputedStartPath[iStartCol].length; i++){
            var aPath = _aPrecomputedStartPath[iStartCol][i];
                if(aPath[iLastIndex].col === iEndCol){
                    aAllPath.push(aPath);
                }
        }

        let aRandomPath = [];
        if(aAllPath.length > 0){
            var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
            aRandomPath = aAllPath[iRandomIndex];
        }
        
        return aRandomPath;
    };

    this._findAllPathDFS = function(branch, path, basket){
        var fork = path.slice(0);
        var i = 0;
        var chld = this._getChildren(branch);
        var len = chld.length;
        fork.push(branch[DIR_SELF]);    ////SET THE INFO YOU WANT TO GET FROM THE NODES
        if (len === 0) { 
          basket.push(fork);
          return basket;
        }
        for (i; i < len; i++){
            this._findAllPathDFS(chld[i], fork, basket);
        } 
        return basket;
    };

    this._getChildren = function(aNode){
        var aChildren = [];

        for (var key in aNode) {
            if(aNode[key]!== null && (key === DIR_BOTLEFT || key === DIR_BOTRIGHT)){
                var iRow = aNode[key].row;
                var iCol = aNode[key].col;
                aChildren.push(_aMatrixMap[iRow][iCol]);
            }
        }
        
        return aChildren;
    };
    
    this._init(aMatrix);
    
    // s_oGridMapping = this;
}

// var s_oGridMapping;
// export default CGridMapping;

const Singleton = (() => {
    let instance = null;
  
    function createInstance(board) {
        return new CGridMapping(board);
    }
  
    return {
      getInstance(isConstructor, board) {
        if (isConstructor) {
          instance = createInstance(board);
        }
        return instance;
      },
    };
})();

const gridInstance = () => Singleton.getInstance(false)
export default Singleton.getInstance;
export {
    gridInstance,
}
