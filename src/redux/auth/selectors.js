export const getAuthState = store => store.auth

export const isAuthentication = store => {
  const { authentication } = getAuthState(store)
  return authentication
};

export const getToken = store => {
  const { token } = getAuthState(store)
  return token
};
