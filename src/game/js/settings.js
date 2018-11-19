const settings = () => {
  // let CANVAS_WIDTH = 1280;
  // let CANVAS_HEIGHT = 1920;
  // let canvasWidth = 375
  // let canvasHeight = 667
  let canvasWidth = 1280
  let canvasHeight = 1920

  const GAME_NAME = 'plinko';

  let EDGEBOARD_X = 150;
  let EDGEBOARD_Y = 200;

  const FPS           = 24;
  const FPS_TIME      = 1000 / FPS;
  const DISABLE_SOUND_MOBILE = false;

  const PRIMARY_FONT = 'impact';
  const SECONDARY_FONT = 'Arial';
  const PRIMARY_FONT_COLOUR = '#FFFFFF';

  const matrixRow = 13;
  const matrixCol = 7;

  let BALL_RADIUS = null;
  let NUM_INSERT_TUBE = null;

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

  const CELL_SIZE = 140;
  const CELL_PIVOT_FROM_CENTER = 90;

  const BALL_FALL_MAX_ANGLE = 0.5;
  const BALL_FALL_MAX_ROTATION = 80;
  const BALL_FALL_ROTATION_ATTENUATION_FACTOR = 20;

  const BALL_FALL_SPEED_INCREASE = 0.75;
  const BALL_FALL_MAX_SPEED_LIMIT = 500; //IN MS

  const BASKET_LIT_ITERATION = 10;

  let PRIZE = [];
  let PRIZE_PROBABILITY = null;

  let ENABLE_FULLSCREEN = null;
  let ENABLE_CHECK_ORIENTATION = null;
  // let AD_SHOW_COUNTER = null;

  let NUM_IMAGES_BACKGROUNDS = null;
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
    getCanvasHeight: () => canvasHeight,

    EDGEBOARD_X,
    EDGEBOARD_Y,

    GAME_NAME,

    FPS,
    FPS_TIME,
    DISABLE_SOUND_MOBILE,

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

    BALL_RADIUS,
    NUM_INSERT_TUBE,

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

    CELL_SIZE,
    CELL_PIVOT_FROM_CENTER ,
    BALL_FALL_MAX_ANGLE,
    BALL_FALL_MAX_ROTATION,
    BALL_FALL_ROTATION_ATTENUATION_FACTOR,

    BALL_FALL_SPEED_INCREASE,
    BALL_FALL_MAX_SPEED_LIMIT,

    BASKET_LIT_ITERATION,

    // PRIZE,
    PRIZE_PROBABILITY,
    ENABLE_FULLSCREEN,
    ENABLE_CHECK_ORIENTATION,
    NUM_IMAGES_BACKGROUNDS,
    // SHOW_CREDITS,
  }
}

// var CANVAS_WIDTH = 1920;
// let CANVAS_HEIGHT = 1080;

// var EDGEBOARD_X = 250;
// var EDGEBOARD_Y = 80;

// var FPS_TIME      = 1000/24;
// var DISABLE_SOUND_MOBILE = false;

// var PRIMARY_FONT = "Lora";
// var SECONDARY_FONT = "Arial";
// var PRIMARY_FONT_COLOUR = "#FFFFFF";

// var STATE_LOADING = 0;
// var STATE_MENU    = 1;
// var STATE_HELP    = 1;
// var STATE_GAME    = 3;

// var ON_MOUSE_DOWN  = 0;
// var ON_MOUSE_UP    = 1;
// var ON_MOUSE_OVER  = 2;
// var ON_MOUSE_OUT   = 3;
// var ON_DRAG_START  = 4;
// var ON_DRAG_END    = 5;

// var NUM_DIFFERENT_BALLS = 5;
// var ANIMATION_SPEED;

// // var WIN_OCCURRENCE = new Array();
// // var WIN_OCCURRENCE = [];
// // var PAYOUTS = []
// const payOuts = []

// var BANK;
// var START_PLAYER_MONEY; 

// // var BET = [];
// var BET = [0.10, 0.20, 0.30, 0.50, 1, 2, 3, 5];


// let ENABLE_FULLSCREEN = true;
// let ENABLE_CHECK_ORIENTATION = true;
// let SHOW_CREDITS =  true;
export default settings();
