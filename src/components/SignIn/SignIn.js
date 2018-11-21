import React from 'react';

import './signIn.css'

function SignIn(props) {
  return <div className="SignIn">
    <img className="title" src="/signIn/title.svg" alt="title" />

    <div className="input">
      <input type="text" />
      <input type="text" />
    </div>
  </div>
}

export default SignIn