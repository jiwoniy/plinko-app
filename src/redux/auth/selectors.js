export const getAuthState = store => store.auth

export const isAuthentication = store => {
  const { authentication } = getAuthState(store)
  return authentication
};
