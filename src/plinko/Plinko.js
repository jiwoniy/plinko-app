import React, { Component } from 'react';
import $ from 'jquery'

import Wallet from 'components/Wallet'
import './js/detectBrowser.js'
import CMain from './js/CMain.js'
import {
  // getParamValue,
  getSize,
  // isIOS,
  // sizeHandler
} from './js/ctl_utils.js'

// import {
//   TEXT_SHARE_IMAGE,
//   TEXT_SHARE_TITLE,
//   TEXT_SHARE_MSG1,
//   TEXT_SHARE_MSG2,
//   TEXT_SHARE_SHARE1,
// } from './js/CLang.js'

import 'plinko/css/main.css'
import 'plinko/css/orientation_utils.css'
import 'plinko/css/canvas.scss'
// import CanvasStyles from 'plinko/css/canvas.scss'

// const BlockGameStyle = {
//   position: 'fixed',
//   backgroundColor: 'transparent',
//   top: '0px',
//   left: '0px',
//   width: '100%',
//   height: '100%',
//   display: 'none'
// }

class Plinko extends Component {
  constructor(props) {
    super(props);

    // this.plinkoMainInstance = null
    this.state = {
      parent: window.parent,
      // plinkoMainInstance: null,
      isPlaying: false,
      width: null,
      height: null
    };

    this.sizeHandler = this.sizeHandler.bind(this)
    $(window).resize(() => {
      this.sizeHandler()
    });
  }

  sizeHandler() {
    // TODO adjust debounce
    const height = getSize('Height');
    const width = getSize('Width');
    this.setState({
      // ...this.state,
      height,
      width,
    })
  }

  createMainInstance = () => {
    const plinkoMainInstance = CMain(true, {
      num_ball: 3,
      prize_settings: [
        { background: "basket_prize", win_occurrence:7, prizewinning: true, redeemlink: "http://www.aaa.com/" },
        { background: null, win_occurrence:7, prizewinning: false, redeemlink: "http://www.aaa.com/" },
        { background: "basket_prize", win_occurrence:7, prizewinning: true, redeemlink: "http://www.aaa.com/" },
        { background: "basket_prize", win_occurrence:7, prizewinning: false, redeemlink: "http://www.aaa.com/" },
        { background: "basket_prize", win_occurrence:7, prizewinning: true, redeemlink: "http://www.aaa.com/" },
        { background: "basket_prize", win_occurrence:7, prizewinning: false, redeemlink: "http://www.aaa.com/" }
      ],
      total_images_backgrounds_in_folder: 4,
      fullscreen: true,
      check_orientation: true,
     })

    $(plinkoMainInstance).on('start_game', (evt) => {
      // make new instance
      this.setState({
        isPlaying: true
      })
      plinkoMainInstance.setCanvasHeight()
      // if(getParamValue('ctl-arcade') === "true") {
      //   this.state.parent.__ctlArcadeStartSession();
      // }
    });

    $(plinkoMainInstance).on('end_game', (evt) => {
      // make new instance
      this.setState({
        isPlaying: false
      })
      
      this.createMainInstance()
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { width: newWidth, height: newHeight } = nextState
    const { width: oldWidth, height: oldHeight } = this.state
    if (newWidth !== oldWidth || newHeight !== oldHeight ) {
      return false
    }
    return true
  }

  componentDidMount () {
    this.createMainInstance()
  }

  render() {
    return (
      <div className="Plinko__container">
        <canvas className="CanvasStyles" id="canvas">
        </canvas>
        {
          this.state.isPlaying &&
          <Wallet
            id="wallet"
          />
        }
        
        {/* <div data-orientation="portrait" className="orientation-msg-container">
          <p className="orientation-msg-text">Please rotate your device</p>
        </div>
        <div
          id="block_game"
          style={BlockGameStyle}>
        </div> */}
      </div>
    );
  }
}

export default Plinko;
