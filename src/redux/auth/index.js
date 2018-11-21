import * as selector from './selectors.js';

export const ADD_TODO = 'ADD_TODO';
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
    case ADD_TODO: {
      // const { id, content } = action.payload;
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

export {
  selector
}
