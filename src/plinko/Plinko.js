import React, { Component } from 'react';
import $ from 'jquery'

import './js/detectBrowser.js'
import CMain from './js/CMain.js'
import {
  getParamValue,
  // isIOS,
  sizeHandler
} from './js/ctl_utils.js'

import {
  TEXT_SHARE_IMAGE,
  TEXT_SHARE_TITLE,
  TEXT_SHARE_MSG1,
  TEXT_SHARE_MSG2,
  TEXT_SHARE_SHARE1,
} from './js/CLang.js'

import 'plinko/css/main.css'
import 'plinko/css/orientation_utils.css'
import CanvasStyles from 'plinko/css/canvas.scss'

const BlockGameStyle = {
  position: 'fixed',
  backgroundColor: 'transparent',
  top: '0px',
  left: '0px',
  width: '100%',
  height: '100%',
  display: 'none'
}

class Plinko extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parent: window.parent,
    };
  }

  componentDidMount () {
    // Menu -> Game
    const mainInstance = CMain(true, {
      num_ball: 3,
      //INSTANT_WIN_WHEEL_SETTINGS sets the win occurrence of each prize in the wheel.
      //      -background: THE BACKGROUND IMAGE NAME IN sprites/prize FOLDER (the images name MUST ALWAYS BE image_#)
      //      -win_occurrence: THE WIN OCCURRENCE OF THAT PRIZE. THE RATIO IS CALCULATED WITH THE FORMULA: (single win occurrence/sum of all occurrences). For instance, in this case, prize of image_2 have 7/42 chance.
      //      -prizewinning: STATES WHETHER THE PRIZE IS WINNING OR NOT. 
      //              IF "false", THE PRIZE HAS NO VALUE AND WILL BE CONSIDERED AS A LOSE. THE GAME WILL CONTINUES UNTIL THE NUM. BALL ENDS OR PLAYER WINS. 
      //              IF "true", THE PRIZE IS CONSIDERED AS A WIN, THE GAME ENDS AND THE PLAYER WILL BE REDIRECTED TO A REDEEM LINK
      //      -redeemlink: INSERT A REDEEM LINK FOR THE OBJECT. IF YOU DON'T WANT TO ADD ANY LINK, LEAVE THE FIELD AS IT IS: (redeemlink: "").
      prize_settings: [
        ///// YOU CAN'T ADD MORE PRIZE SLOT
        { background: "basket_prize", win_occurrence:7, prizewinning: true, redeemlink: "http://www.aaa.com/" },
        { background: "image_0", win_occurrence:7, prizewinning: false, redeemlink: "http://www.aaa.com/" },
        { background: "image_2", win_occurrence:7, prizewinning: true, redeemlink: "http://www.aaa.com/" },
        { background: "image_0", win_occurrence:7, prizewinning: false, redeemlink: "http://www.aaa.com/" },
        { background: "image_3", win_occurrence:7, prizewinning: true, redeemlink: "http://www.aaa.com/" },
        { background: "image_0", win_occurrence:7, prizewinning: false, redeemlink: "http://www.aaa.com/" }
      ],
      total_images_backgrounds_in_folder: 4, 	////SET HERE THE EXACT NUMBER OF BACKGROUND IMAGES IN GAME FOLDER IF YOU WANT TO ADD MORE DIFFERENT IMAGES
      fullscreen: true,            //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
      check_orientation: true,     //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES   
      //////////////////////////////////////////////////////////////////////////////////////////
      // ad_show_counter: 5     //NUMBER OF BALL PLAYED BEFORE AD SHOWN
      //
     });
     
    $(mainInstance).on("start_session", function(evt) {
      if(getParamValue('ctl-arcade') === "true") {
        this.state.parent.__ctlArcadeStartSession();
      }
    });

    $(mainInstance).on("end_session", function(evt) {
      if(getParamValue('ctl-arcade') === "true") {
        this.state.parent.__ctlArcadeEndSession();
      }
    });

    $(mainInstance).on("restart_level", function(evt, iLevel) {
      if(getParamValue('ctl-arcade') === "true"){
        this.state.parent.__ctlArcadeRestartLevel({level:iLevel});
      }
    });

    $(mainInstance).on("save_score", function(evt,iScore, szMode) {
      if(getParamValue('ctl-arcade') === "true") {
        this.state.parent.__ctlArcadeSaveScore({score:iScore, mode: szMode});
      }
    });

    $(mainInstance).on("start_level", function(evt, iLevel) {
      if(getParamValue('ctl-arcade') === "true"){
        this.state.parent.__ctlArcadeStartLevel({level:iLevel});
      }
    });

    $(mainInstance).on("end_level", function(evt,iLevel) {
      if(getParamValue('ctl-arcade') === "true") {
        this.state.parent.__ctlArcadeEndLevel({level:iLevel});
      }
    });

    $(mainInstance).on("show_interlevel_ad", function(evt) {
      if(getParamValue('ctl-arcade') === "true") {
        this.state.parent.__ctlArcadeShowInterlevelAD();
      }
    });

    $(mainInstance).on("share_event", function(evt, iScore) {
      if(getParamValue('ctl-arcade') === "true") {
        this.state.parent.__ctlArcadeShareEvent({
          img: TEXT_SHARE_IMAGE,
          title: TEXT_SHARE_TITLE,
          msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
          msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1
        });
      }
    });

    // if (isIOS()) { 
    //   setTimeout(function() {
    //     sizeHandler();
    //   },200); 
    // } else {
    //   sizeHandler(); 
    // } 

    // sizeHandler();
  }
  render() {
    return (
      <div className="Plinko__container">
        <canvas className="CanvasStyles" id="canvas">
        </canvas>
        <div data-orientation="portrait" className="orientation-msg-container">
          <p className="orientation-msg-text">Please rotate your device</p>
        </div>
        <div
          id="block_game"
          style={BlockGameStyle}>
        </div>
      </div>
    );
  }
}

export default Plinko;
