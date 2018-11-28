import { handleActions } from 'redux-actions';

import * as selector from './selectors.js';
import * as actions from './actions.js';
import * as types from './types'

const initialState = {
  balance: null
};

const reducer = handleActions({
  [types.SET_BALANCE]:  (state, action) => {
    return {
      ...state,
      balance: action.payload,
    };
  }
}, initialState);

export default reducer

export {
  actions,
  selector
}
