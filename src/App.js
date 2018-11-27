import React from 'react';
import { connect } from 'react-redux';

import SignIn from 'components/SignIn'
import Plinko from 'plinko/Plinko';
import { selector as authSelector } from 'redux/auth';

const mapStateToProps = state => {
  return {
    isAuthentication: () => authSelector.isAuthentication(state)
  };
};

function App (props) {
  const { isAuthentication } = props
  if (isAuthentication()) {
    return <Plinko />
  }
  return <SignIn />
}

export default connect(mapStateToProps)(App);
