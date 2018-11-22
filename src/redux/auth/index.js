import * as selector from './selectors.js';

export const SIGN_TEST = 'SIGN_TEST';
// export const TOGGLE_TODO = "TOGGLE_TODO";
// export const SET_FILTER = "SET_FILTER";

// Authentication
// Authorization
const initialState = {
  authentication: false,
  token: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SIGN_TEST: {
      // const { id, content } = action.payload;
      return {
        ...state,
        authentication: true,
      };
    }
    default:
      return state;
  }
}

export {
  selector
}
