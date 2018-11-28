import React, { Component } from 'react';
import CssModules from 'react-css-modules'
import { connect } from 'react-redux';

import SignIn_styles from './signIn.scss'
import { selector as authSelector, actions as authActions } from 'redux/auth';

const mapStateToProps = state => {
  return {
    isAuthentication: () => authSelector.isAuthentication(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // setAuthFlag: (payload) => dispatch(authActions.setAuth(payload)),
    handleSignin: (payload) => dispatch(authActions.handleSignin(payload))
  };
};

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      autosign: false
    };
  }

  handleInputChange = (e) => {
    if (e.target.name === 'autosign') {
      if (e.target.value === 'true') {
        this.setState({
          [e.target.name]: false
        });
      } else {
        this.setState({
          [e.target.name]: true
        });
      }
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }    
  }
  
  handleSignIn = (e) => {
    const { /* setAuthFlag, */ handleSignin } = this.props
    handleSignin({
      email: this.state.email,
      password: this.state.password
    })
    // setAuthFlag(true)
  }

  render () {
    return <div className="SignIn">
    <div className="contents">
      <img className="title" src="/plinko/signIn/title.svg" alt="title" />

      <div className="input_container">
        <input
          type="text"
          name="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={this.state.password}
          onChange={this.handleInputChange}
        />

        <p className="checkbox__container">
          <input
            type="checkbox"
            id="remember"
            name="autosign"
            value={this.state.autosign}
            onChange={this.handleInputChange}
          />
          <label htmlFor="remember" />Remember Me
        </p>
      </div>

      <div className="button_container">
        <button
          onClick={this.handleSignIn}
        > 
          SignIn
        </button>
        <button> SignUp </button>
      </div>

      {/* <div className="social_container">
      </div> */}
      </div>
  </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CssModules(SignIn, SignIn_styles))