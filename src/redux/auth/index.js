import * as selector from './selectors.js';

export const SET_AUTH_AUTHENTICATION = 'SET_AUTH_AUTHENTICATION';

const initialState = {
  authentication: true,
  token: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH_AUTHENTICATION: {
      return {
        ...state,
        authentication: action.payload,
      };
    }
    default:
      return state;
  }
}

export {
  selector
}
