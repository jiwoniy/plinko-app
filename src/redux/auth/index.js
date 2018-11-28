import { handleActions } from 'redux-actions';
import * as selector from './selectors.js';
import * as actions from './actions.js';
import * as types from './types'

const initialState = {
  authentication: false,
  token: {},
  user: null
};

const reducer = handleActions({
  [types.SET_AUTH]:  (state, action) => {
    return {
      ...state,
      authentication: action.payload,
    };
  },
  [types.SET_TOKEN]:  (state, action) => {
    return {
      ...state,
      token: action.payload,
    };
  },
  [types.SET_USER_INFO]:  (state, action) => {
    return {
      ...state,
      user: action.payload,
    };
  }
}, initialState);

export default reducer

export {
  actions,
  selector
}
