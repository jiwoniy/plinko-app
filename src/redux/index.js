import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from './reducers';

const testmiddleware = store => next => async action => {
  /* 미들웨어 내용 */

  // console.log('현재 상태', store.getState());
  // // 액션 기록
  // console.log('액션', action);

  // 액션을 다음 미들웨어, 혹은 리듀서로 넘김
  const result = await next(action);
  console.log(result)
  // 액션 처리 후의 스토어 상태 기록
  // console.log('다음 상태', store.getState());
  // console.log('\n'); // 기록 구분을 위한 
  return result
}

const middleware = [ thunk, testmiddleware ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

export default createStore(
  rootReducer,
  applyMiddleware(...middleware)
);