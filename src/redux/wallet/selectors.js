export const getWalletState = store => store.wallet

export const getBalance = store => {
  const { balance } = getWalletState(store)
  return balance
}
