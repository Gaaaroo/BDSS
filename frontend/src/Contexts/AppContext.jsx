import React, { createContext, useState, useContext, useEffect } from 'react';

import { getUserProfile } from '../services/api/userService';
import { useNavigate } from 'react-router';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [profile, setProfile] = useState();
  const [role, setRole] = useState(null); //'Staff' 'Admin' 'Member'
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLogged(true);
      getUserRole();
    } else {
      setIsLogged(false);
      setProfile(null);
    }
  }, []);

  const getUserRole = async () => {
    try {
      const data = await getUserProfile();
      // console.log(data);
      setRole(data.role);
      switch (data.role) {
        case 'MEMBER':
          navigate('/');
          break;
        case 'STAFF':
          navigate('/dashboard');
          break;
        case 'ADMIN':
          navigate('/');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (err) {
      console.log('Error when setRole:', err);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await getUserProfile();
      setProfile(res);
    } catch (err) {
      console.log('Error when save profile', err);
    }
  };

  useEffect(() => {
    if (isLogged) {
      getUserRole();
      saveProfile();
    }
  }, [isLogged]);

  function logout() {
    setIsLogged(false);
    setProfile(null);
    localStorage.clear();
  }

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        isLogged,
        setIsLogged,
        logout,
        getUserRole,
        role,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
