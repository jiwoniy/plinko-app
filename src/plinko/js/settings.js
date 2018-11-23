import {
  getSize
} from './ctl_utils.js'

const settings = () => {
  // let CANVAS_WIDTH = 1280;
  // let CANVAS_HEIGHT = 1920;
  let canvasWidth = 0
  let canvasHeight = 0

  // let canvasWidth = getSize('Width')
  // let canvasHeight = getSize('Height')

  const GAME_NAME = 'plinko';

  let EDGEBOARD_X = 150;
  let EDGEBOARD_Y = 200;
  // const tubuStartPosition = {
  //   x: 100,
  //   y: 150
  // }

  const FPS           = 24;
  const FPS_TIME      = 1000 / FPS;
  let isAbleSound = false;

  const PRIMARY_FONT = 'impact';
  const SECONDARY_FONT = 'Arial';
  const PRIMARY_FONT_COLOUR = '#FFFFFF';

  const matrixRow = 13;
  const matrixCol = 7;

  // let BALL_RADIUS = null;
  let ballRadius = null
  let insertTubeNumber = null
  // let NUM_INSERT_TUBE = null;

  const STATE_LOADING = 0;
  const STATE_MENU    = 1;
  const STATE_HELP    = 1;
  const STATE_GAME    = 3;

  const ON_MOUSE_DOWN  = 0;
  const ON_MOUSE_UP    = 1;
  const ON_MOUSE_OVER  = 2;
  const ON_MOUSE_OUT   = 3;
  const ON_DRAG_START  = 4;
  const ON_DRAG_END    = 5;

  const NUM_DIFFERENT_BALLS = 5;
  let ANIMATION_SPEED;

  // const CELL_SIZE = 140;
  let cellSize = 31 // base 375 widht 
  // const CELL_PIVOT_FROM_CENTER = 90;
  // const CELL_PIVOT_FROM_CENTER = 30;
  const cellPivotFronCenter = 30;

  const BALL_FALL_MAX_ANGLE = 0.5;
  const BALL_FALL_MAX_ROTATION = 80;
  const BALL_FALL_ROTATION_ATTENUATION_FACTOR = 20;

  const BALL_FALL_SPEED_INCREASE = 0.75;
  const BALL_FALL_MAX_SPEED_LIMIT = 500; //IN MS

  const BASKET_LIT_ITERATION = 10;

  let PRIZE = [];
  let PRIZE_PROBABILITY = null;

  // let ENABLE_FULLSCREEN = null;
  let enableFullscreen = true;
  // let ENABLE_CHECK_ORIENTATION = null;
  let enableCheckOrientation = null
  // let AD_SHOW_COUNTER = null;

  // let NUM_IMAGES_BACKGROUNDS = null;
  let basketImageNumber = null
  let NUM_BALL = 0;

  return {
    getNumBall: () => NUM_BALL,
    setNumBall: (value) => {
      NUM_BALL = value
    },
    getPrize: () => PRIZE,
    setPrize: (value) => {
      PRIZE = value
    },
    // getAdShowCounter: () => AD_SHOW_COUNTER,
    // setAdShowCounter: (value) => {
    //   AD_SHOW_COUNTER = value
    // },

    // CANVAS_WIDTH,
    // CANVAS_HEIGHT,
    getCanvasWidth: () => canvasWidth,
    setCanvasWidth: () => {
      const canvasElement = document.getElementById("canvas");
      const width = getSize('Width')
      canvasElement.width = width
      canvasWidth = width
    },
    getCanvasHeight: () => canvasHeight,
    setCanvasHeight: () => {
      const canvasElement = document.getElementById("canvas");
      const height = getSize('Height')
      canvasElement.height = height
      canvasHeight = height
    },

    getDeviceWidthRatio: (imageWidth) => {
      const origin = 375
      const value = (imageWidth * canvasWidth) / origin
      return value
    },
    getDeviceHeightRatio: (imageHeight) => {
      const origin = 667
      const value = (imageHeight * canvasHeight) / origin
      return value
    },
    getCellGapSize: () => {
      const originCellSize = cellSize
      const origin = 375

      const value = (originCellSize * canvasWidth) / origin
      return value
    },

    // getTubeStartPosition: () => {
    //   return tubuStartPosition
    // },

    get10PercentWidth: () => {
      return canvasWidth * 0.1
    },

    get80PercentWidth: () => {
      return canvasWidth * 0.8
    },

    get5PercentHeight: () => {
      return canvasHeight * 0.05
    },

    get10PercentHeight: () => {
      return canvasHeight * 0.1
    },

    get80PercentHeight: () => {
      return canvasHeight * 0.8
    },

    getCellPivotFronCenter: () => {
      return cellPivotFronCenter
    },

    EDGEBOARD_X,
    EDGEBOARD_Y,

    GAME_NAME,

    FPS,
    FPS_TIME,
    getIsAbleSound: () => isAbleSound,
    setIsAbleSound: (value) => {
      isAbleSound = value
    },
    // DISABLE_SOUND_MOBILE,

    PRIMARY_FONT,
    SECONDARY_FONT,
    PRIMARY_FONT_COLOUR,

    STATE_LOADING,
    STATE_MENU,
    STATE_HELP,
    STATE_GAME,

    ON_MOUSE_DOWN,
    ON_MOUSE_UP,
    ON_MOUSE_OVER,
    ON_MOUSE_OUT,
    ON_DRAG_START,
    ON_DRAG_END,

    getMatrixRow: () => matrixRow,
    getMatrixCol: () => matrixCol,

    // BALL_RADIUS,
    getBallRadius: () => ballRadius,
    setBallRadius: (value) => {
      ballRadius = value
    },
    // NUM_INSERT_TUBE,

    getInsertTubeNumber: () => insertTubeNumber,
    setInsertTubeNumber: (value) => {
      insertTubeNumber = value
    },

    NUM_DIFFERENT_BALLS,
    ANIMATION_SPEED,

    // WIN_OCCURRENCE,
    // PAYOUTS,
    // getPayOuts: () => payOuts,
    // setPayOuts: (payload) => {
    //   payOuts = payload
    // },
    // // payOuts,
    // BANK,
    // START_PLAYER_MONEY,

    // BET,
    // CELL_SIZE,
    // CELL_PIVOT_FROM_CENTER ,
    BALL_FALL_MAX_ANGLE,
    BALL_FALL_MAX_ROTATION,
    BALL_FALL_ROTATION_ATTENUATION_FACTOR,

    BALL_FALL_SPEED_INCREASE,
    BALL_FALL_MAX_SPEED_LIMIT,

    BASKET_LIT_ITERATION,

    // PRIZE,
    PRIZE_PROBABILITY,
    // ENABLE_FULLSCREEN,
    getEnableFullScreen: () => enableFullscreen,
    setEnableFullScreen: (value) => {
      enableFullscreen = value
    },

    getEnableCheckOrientation: () => enableCheckOrientation,
    setEnableCheckOrientation: (value) => {
      enableCheckOrientation = value
    },
    // ENABLE_CHECK_ORIENTATION,
    // NUM_IMAGES_BACKGROUNDS,
    getBasketImageNumber: () => basketImageNumber,
    setBasketImageNumber: (value) => {
      basketImageNumber = value
    }
    // SHOW_CREDITS,
  }
}

// const self = settings()
export default settings();
