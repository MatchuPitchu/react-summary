import { createContext, useState, useEffect, useCallback } from 'react';

// globally available variable in this file
let logoutTimer;

// use React Context to store user authentication information
const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  // first search if token is stored in browser; returns either undefined or token string
  // DON'T need useEffect since localStorage is a synchronous API (-> otherwise useEffect would be necessary)
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const isLoggedIn = !!token; // converts truthy or falsy value to boolean true or false

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    clearTimeout(logoutTimer); // clear timer always when user logs out
  }, []);

  const login = useCallback(
    (token, expirationDate) => {
      // Browser built-in API to get access to browser storage;
      // only able to store primive values (-> use JSON.stringify(object/array) to be able to store this data too);
      // store a key value pair
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate);
      // after user logs in, automatically logout is set with calculation of remaining valid token time;
      // Date.now() returns current timestamp in ms
      logoutTimer = setTimeout(logout, expirationDate - Date.now());
      setToken(token);
    },
    [logout]
  );

  useEffect(() => {
    if (token) {
      let timeLeft = localStorage.getItem('expirationDate') - Date.now();
      // if useEffect is executed AND left time is below certain threshold then user is automatically logged out
      if (timeLeft < 6000) logout();
      else logoutTimer = setTimeout(logout, timeLeft);
      console.log('time left', timeLeft);
    }
  }, [token, logout]);

  const contextValues = {
    token,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>;
};

export default AuthContext;
