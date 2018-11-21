import { combineReducers } from 'redux';

import auth from './auth/index';
import common from './common/index';

export default combineReducers({ auth, common });