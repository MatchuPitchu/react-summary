import React, { useState, useEffect } from 'react';

// create an default(!) blueprint obj that contains components with an app wide state storage;
// this helps e.g. for autocompletion in VSC
const AuthContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});

// create context component and export it as a named export;
// now I can use useState and insert more logic into this component
export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('isLoggedIn');
    if (userLoggedIn === '1') setIsLoggedIn(true);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways

    // save login status in browser storage;
    // both storage key and storage value have to be string
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn, // shorthand to "isLoggedIn: isLoggedIn", etc.
        logoutHandler,
        loginHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
