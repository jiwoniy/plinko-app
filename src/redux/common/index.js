import { handleActions } from 'redux-actions';

import * as selector from './selectors.js';
import * as types from './types'

const initialState = {
  width: null,
  height: null
};

const reducer = handleActions({
  [types.SET_WIDTH]:  (state, action) => {
    return {
      ...state,
      width: action.payload,
    };
  }
}, initialState);

export default reducer

export {
  selector
}
