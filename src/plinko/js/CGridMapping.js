import settings from './settings.js'

var DIR_TOPRIGHT = "DIR_TOPRIGHT";
var DIR_BOTRIGHT = "DIR_BOTRIGHT";
var DIR_TOPLEFT = "DIR_TOPLEFT";
var DIR_BOTLEFT = "DIR_BOTLEFT";
var DIR_SELF = "DIR_SELF";

function CGridMapping(boardMatrix) {
    this.state = {
        row: settings.getMatrixRow(),
        col: settings.getMatrixCol(),
        boardMatrix: boardMatrix || []
    }

    this.precomputedStartPath = []
    this.radiusMap = []
    this.matrixMap = []

    this.initGridMapping = () => {
        this.buildPathMap();
        for (let i = 0; i < this.state.boardMatrix[0].length; i += 1) {
            this.precomputedStartPath[i] = this.getAllPathFrom({ row: 0, col: i });
        }
    };
    
    this.buildPathMap = () => {
        // initialize matrixMap
        for (let i = 0; i < this.state.boardMatrix.length; i += 1) {
            this.matrixMap[i] = [];
            for (let j = 0; j < this.state.boardMatrix[i].length; j += 1) {
                this.matrixMap[i][j] = [];
            }
        }

        for (let i = 0; i < this.state.boardMatrix.length; i += 1) {
            for (let j = 0; j < this.state.boardMatrix[i].length; j += 1) {
                this.matrixMap[i][j][DIR_BOTRIGHT] = this.setNeighbor(i, j, DIR_BOTRIGHT);
                this.matrixMap[i][j][DIR_BOTLEFT] = this.setNeighbor(i, j, DIR_BOTLEFT);
                this.matrixMap[i][j][DIR_SELF] = this.setNeighbor(i, j, DIR_SELF);
            }
        }
    };
    
    this.setNeighbor = (r, c, direction) => {
        let nextDir = null;
        switch (direction) {
            ////r%2 IS USED TO DETECT INDEX COLUMN FOR AN "ODD-ROW" HORIZONTAL LAYOUT HEX GRID. FOR EXAMPLE, IF ROW IS ODD, THE TOPRIGHT NEIGHBOR IS = COL+1. IF ROW IS EVEN, THE TOPRIGHT NEIGHBOR IS = COL. 
            case DIR_TOPRIGHT: {
                if (r > 0 && c < this.state.col - (r % 2)) {
                    nextDir = { row: r - 1, col: c + ((r + 1) % 2) };
                }
                break;
            }
            case DIR_BOTRIGHT: {
                if (r < this.state.row - 1 && c + (r % 2) < this.state.col) {
                    nextDir = { row: r + 1, col: c + ((r + 1) % 2) };
                }
                break;
            }
            case DIR_TOPLEFT: {
                if (r > 0 && c - ((r - 1) % 2) >= 0) {
                    nextDir = { row: r - 1, col: c - ((r + 1) % 2) };
                }
                break;
            }
            case DIR_BOTLEFT: {
                if (r < this.state.row - 1 && c >= r % 2) {
                    nextDir = { row: r + 1, col: c - (r % 2) };
                }
                break;
            } 
            case DIR_SELF: {
                nextDir = { row: r, col: c };
                break;
            }
            default:
                break;
        }
        
        return nextDir;
    };
    
    // this._getNeighborByDir = (iRow, iCol, iDir) => {
    //     return this.matrixMap[iRow][iCol][iDir];
    // };
    
    // this._getAllNeighbor = (iRow, iCol) => {
    //     const aNeighborList = [];
        
    //     for (let key in this.matrixMap[iRow][iCol]) {
    //         if(this.matrixMap[iRow][iCol][key]!== null){
    //             aNeighborList.push(this.matrixMap[iRow][iCol][key]);
    //         }
    //     }
        
    //     return aNeighborList;
    // };
    
    // this._getMainDiagonal = (iRow, iCol, aBoard) => {
    //     var aList = [];
        
    //     var szColor = aBoard[iRow][iCol].getColor();
        
    //     this._findInDirection(iRow, iCol, DIR_BOTRIGHT, aList, 99, szColor, aBoard);
    //     this._findInDirection(iRow, iCol, DIR_TOPLEFT, aList, 99, szColor, aBoard);
        
    //     return aList;
    // };
    
    // this._getSecondDiagonal = (iRow, iCol, aBoard) => {
    //     var aList = [];
        
    //     var szColor = aBoard[iRow][iCol].getColor();
        
    //     this._findInDirection(iRow, iCol, DIR_BOTLEFT, aList, 99, szColor, aBoard);
    //     this._findInDirection(iRow, iCol, DIR_TOPRIGHT, aList, 99, szColor, aBoard);

    //     return aList;
    // };
    
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
    
    // this._getStraightByDirAndRadius = function(iRow, iCol, szDir, iRadius, aBoard) {
    //     var aList = [];
    //     this.radiusMap = [];

    //     this.radiusMap.push({radius:iRadius, direction: null});
        
    //     var szColor = aBoard[iRow][iCol].getColor();
        
    //     this._findInDirection(iRow, iCol, szDir, aList, iRadius, szColor, aBoard);
        
    //     return aList;
    // };
    
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
    
    // this._findInDirection = function(iRow, iCol, iDir, aList, iRadius, szColor, aBoard) {

    //     var iCountRadius = iRadius-1;
        
    //     if(this.matrixMap[iRow][iCol][iDir] !== null && iCountRadius>=0){
    //         var iNextRow = this.matrixMap[iRow][iCol][iDir].row;
    //         var iNextCol = this.matrixMap[iRow][iCol][iDir].col;

    //         if(szColor){
    //             var szNextColor = aBoard[iNextRow][iNextCol].getColor();
    //             if(szNextColor === szColor){
    //                 return;
    //             } else if (szNextColor === null) {
    //                 aList.push({row: iNextRow, col: iNextCol});
    //                 this.radiusMap.push({radius:iCountRadius, direction: iDir});

    //                 this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
    //             } else {
    //                 aList.push({row: iNextRow, col: iNextCol});
    //                 this.radiusMap.push({radius:iCountRadius, direction: iDir});
    //             }
    //         } else {
    //             aList.push({row: iNextRow, col: iNextCol});
    //             this.radiusMap.push({radius:iCountRadius, direction: iDir});
    //             this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius, szColor, aBoard);
    //         }
    //     }
    // };

    this.getAllPathFrom = (cellPosition) => {
        return this.findAllPathDFS(this.matrixMap[cellPosition.row][cellPosition.col], [], []);
    };

    // this.getRandomPathFrom = (oPos) => {
    //     const aAllPath = this.getAllPathFrom(oPos);
        
    //     let aRandomPath = [];
    //     if(aAllPath.length > 0){
    //         var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
    //         aRandomPath = aAllPath[iRandomIndex];
    //     }

    //     return aRandomPath;
    // };

    //////WITHOUT STOP TO DEST NODE
    // this.getAllPathFromTo = (oStartPos, oEndPos) => {
    //     var aAllPath = this.getAllPathFrom(oStartPos);
        
    //     for(var i=aAllPath.length-1; i>=0; i--){
    //         var bNodeFound = false;
    //         for(var j=0; j<aAllPath[i].length; j++){
    //             if(aAllPath[i][j].row === oEndPos.row && aAllPath[i][j].col === oEndPos.col){
    //                 bNodeFound = true;
    //                 break;
    //             }
    //         }
    //         if(!bNodeFound){
    //             aAllPath.splice(i,1);
    //         }
    //     }

    //     return aAllPath;
    // };

    //////WITHOUT STOP TO DEST NODE
    // this.getRandomPathFromTo = (oStartPos, oEndPos) => {
    //     var aAllPath = this.getAllPathFromTo(oStartPos, oEndPos);
        
    //     let aRandomPath = [];
    //     if(aAllPath.length > 0){
    //         var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
    //         aRandomPath = aAllPath[iRandomIndex];
    //     }

    //     return aRandomPath;
    // };

    // this.getRandomPathFromCol = function(iCol) {
    //     var aAllPath = this.precomputedStartPath[iCol];
        
    //     var iRandomIndex = Math.floor(Math.random()*(aAllPath.length-1));
    //     var aRandomPath = aAllPath[iRandomIndex];

    //     return aRandomPath;
    // };
    
    this.getRandomPathFrom = function(startIndex, destinationIndex) {    
        const availablePath = [];
        const lastIndex = this.matrixMap.length - 1;
        
        for(let i = 0; i < this.precomputedStartPath[startIndex].length; i += 1) {
            const aPath = this.precomputedStartPath[startIndex][i];
            if (aPath[lastIndex].col === destinationIndex) {
                availablePath.push(aPath);
            }
        }

        let randomPath = [];
        if (availablePath.length > 0) {
            const iRandomIndex = Math.floor(Math.random() * (availablePath.length - 1));
            randomPath = availablePath[iRandomIndex];
        }

        return randomPath;
    };

    this.findAllPathDFS = (branch, path, basket) => {
        const fork = path.slice(0);
        const chld = this.getChildren(branch);
        const len = chld.length;
        fork.push(branch[DIR_SELF]);    ////SET THE INFO YOU WANT TO GET FROM THE NODES
        if (len === 0) { 
          basket.push(fork);
          return basket;
        }

        for (let i = 0; i < len; i += 1) {
            this.findAllPathDFS(chld[i], fork, basket);
        } 
        return basket;
    };

    this.getChildren = function(node) {
        const child = [];

        for (let key in node) {
            if(node[key]!== null && (key === DIR_BOTLEFT || key === DIR_BOTRIGHT)) {
                const row = node[key].row;
                const col = node[key].col;
                child.push(this.matrixMap[row][col]);
            }
        }
        
        return child;
    };
    
    this.initGridMapping();
    // s_oGridMapping = this;
}

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
