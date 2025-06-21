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
      console.log(data);
      setRole(data.role);
      console.log('role nè:', data.role);
      switch (data.role) {
        case 'MEMBER':
          console.log('Đây là member');
          navigate('/');
          break;
        case 'STAFF':
          console.log('Đây là Staff');
          navigate('/dashboard');
          break;
        case 'ADMIN':
          console.log('Đây là Admin');
          navigate('/');
          break;
        default:
          console.log('Welcome to my website');
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
      console.log('call api profile');
      getUserRole();
      saveProfile();
    }
  }, [isLogged]);

  function logout() {
    setIsLogged(false);
    setProfile(null);
    localStorage.clear();
    console.log('Logout successful!');
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
