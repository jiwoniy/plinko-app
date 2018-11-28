import { createAction } from 'redux-actions';

import * as types from './types'
// import store from '../../redux';
// import { selector as authSelector } from '../auth'
import balanceApi from '../../api/balance'


// define auth actions
export const setBalance = createAction(types.SET_BALANCE); // color

export const getWallet = (payload) => async (dispatch, getState) => {
  const { auth } = getState()
  if (auth && auth.token) {
    const result = await balanceApi.getBalance(auth.token)
    if (result && result.isSuccess) {
      const { balance } = result.data
      dispatch(setBalance(Number(balance)))
    }
  }

}

