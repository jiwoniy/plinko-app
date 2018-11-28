import React, { Component } from 'react'
import CssModules from 'react-css-modules'
import { connect } from 'react-redux'
import Odometer from 'odometer'
import PropTypes from 'prop-types'

import './odometer-theme-digital.css'
import Wallet_styles from './wallet.scss'
import { selector as walletSelector, actions as walletActions } from 'redux/wallet';

const mapStateToProps = state => {
  return {
    myBalance: walletSelector.getBalance(state)
  };
};
const mapDispatchToProps = (dispatch, getState) => {
  return {
    getWallet: payload => dispatch(walletActions.getWallet(payload, getState)),
  };
};


class Wallet extends Component {
  constructor(props) {
    super(props);

    this.betInstance = null
    this.balanceInstance =  null

    this.state = {
      balance_amount: 100,
      bet_amount: null
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.myBalance !== prevState.balance_amount) {
      return { balance_amount: nextProps.myBalance };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  bettingAmountHandler =  (event) => {
    let amount = this.state.bet_amount
    const target = event.target.value || event.target.parentNode.value
    if (target === 'increment') {
      amount += 5
    } else if (target === 'decrement') {
      amount -= 5
    }

    this.setState({
      bet_amount: amount,
    })
  }

  removeWallet = () => {
    this.betInstance = null
    this.balanceInstance = null
  }

  makeWallet = () => {
    const elBet = document.getElementById('bettingAmount')
    const elBalance = document.getElementById('balanceAmount')
    if (!this.betInstance) {
      this.betInstance = new Odometer({
        el: elBet,
        value: this.state.bet_amount,
        duration: 500, 
        format: '(,ddd)',
        // theme: 'car',
        // theme: 'train-station',
        theme: 'digital',
        animation: 'count' 
      })
      this.betInstance.render()
      // this.state.betInstance.render();
    }

    if (!this.balanceInstance) {
      this.balanceInstance = new Odometer({
          el: elBalance,
          value: this.state.balance_amount,
          duration: 500, 
          format: '(,ddd)',
          // theme: 'car',
          // theme: 'train-station',
          theme: 'digital',
          animation: 'count' 
        })
        this.balanceInstance.render()
      // this.state.balanceInstance.render();
    }
  }
  componentDidMount() {
    this.makeWallet()
    const { getWallet } = this.props
    getWallet()
  }

  // https://github.com/facebook/react/issues/14224#issuecomment-440011268
  render () {
    return <div className="Wallet">
      <img className="title" src="/plinko/my_wallet.svg" alt="title" />
      <div className="container">
        <div className="balance-container">
          <div id="balanceAmount" className="odometer">
            { this.state.balance_amount }
          </div>
        </div>

        <div className="bet-container">
          <div id="bettingAmount" className="odometer">
            { this.state.bet_amount }
          </div>
          <div className="button-container">
            <button className="plus-button" onClick={this.bettingAmountHandler} value="increment">
              <img src="/plinko/plus.svg" alt="plus" />
            </button>
            <button className="minus-button" onClick={this.bettingAmountHandler} value="decrement">
              <img src="/plinko/minus.svg" alt="minus" />
            </button>
          </div>
        </div>

      </div>
    </div>
  }
}

Wallet.defaultProps = {
  isPlaying: false
};

Wallet.propTypes = {
  isPlaying: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(CssModules(Wallet, Wallet_styles))