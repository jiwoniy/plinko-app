import { combineReducers } from 'redux';

import auth from './auth';
import common from './common';
import wallet from './wallet';

export default combineReducers({ auth, common, wallet });