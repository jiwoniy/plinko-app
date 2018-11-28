import { createAction } from 'redux-actions';

import * as types from './types'

// define auth actions
export const setAuth = createAction(types.SET_AUTH); // color
export const setToken = createAction(types.SET_TOKEN);
export const setUserInfo = createAction(types.SET_USER_INFO);
// export const requestSignIn = createAction(types.HANDLE_SIGNIN); // color

// https://velopert.com/3401
// 비동기 dispatch
// export const handleSignin = (payload) => async dispatch => {
//   console.log('handleSignin')
//   console.log(payload)
//   const { email, password } = payload
//   const result = await authApp.auth()
//   .signInWithEmailAndPassword(email, password)
//   .catch(function(error) {
//     // Handle Errors here.
//     console.log('---------error---------')
//     console.log(error)
//     // [END_EXCLUDE]
//   });
//   console.log(result)
 
//   // dispatch(requestSignIn(payload))
// //   setTimeout(
// //       () => { dispatch(requestSignIn(payload)) },
// //       1000
// //   );
// }