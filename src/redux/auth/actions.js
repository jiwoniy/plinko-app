import { createAction } from 'redux-actions';
import * as types from './types'

export const setAuth = createAction(types.SET_AUTH); // color

// https://velopert.com/3401
// 비동기 dispatch
export const incrementAsync = (payload) => dispatch => {
  setTimeout(
      () => { dispatch(setAuth(payload)) },
      1000
  );
}