import React from 'react';
import ReactDOM from 'react-dom';
import firebaseApp from 'firebase/app';
import 'firebase/auth';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import store from './redux';
import { actions as authActions } from 'redux/auth';
import * as serviceWorker from './serviceWorker';

// TODO (jiwoniy) remove later
const config = {
  apiKey: 'AIzaSyAxk1aIqRAd4hiaOPHexj3vFXo0gmeEDDE',
  authDomain: "eiam-695f7.firebaseapp.com",
  databaseURL: "https://eiam-695f7.firebaseio.com",
  projectId: "eiam-695f7",
  storageBucket: "eiam-695f7.appspot.com",
  messagingSenderId: "811177682224",
};
const authApp = firebaseApp.initializeApp(config);

// https://edencore-end-point-dot-manifest-ivy-213501.appspot.com/api/browse/#/user.signup
// https://github.com/firebase/quickstart-js/blob/master/auth/google-credentials.html
// https://firebase.google.com/docs/auth/web/manage-users
// https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=ko
async function authStateChange (user) {
  if (user) {
    const { auth } = store.getState()
    if (!auth.authentication) {
      const idToken = await user.getIdToken()
      store.dispatch(authActions.setToken(idToken))
      store.dispatch(authActions.setUserInfo({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName
      }))
      store.dispatch(authActions.setAuth(true))
      // const emailVerified = user.emailVerified;
      // const providerData = user.providerData;
      // console.log(emailVerified)
      // console.log(providerData)
    }
  }
}
authApp.auth()
  .onAuthStateChanged(authStateChange)


// localstorage check
// redux-hyper~~

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
