import { handleActions } from 'redux-actions';
import * as selector from './selectors.js';
import * as actions from './actions.js';
import * as types from './types'

const initialState = {
  authentication: true,
  token: {}
};

const reducer = handleActions({
  [types.SET_AUTH]:  (state, action) => {
    console.log(action.payload)
    return {
      ...state,
      authentication: action.payload,
    };
  }
}, initialState);

export default reducer

export {
  actions,
  selector
}
