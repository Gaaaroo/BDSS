import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  function logout() {
    setIsLogged(false);
    navigate('/');
    localStorage.clear();
    console.log('handle logout');
  }

  return (
    <AppContext.Provider value={{ isLogged, setIsLogged, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
