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
    const savedProfile = localStorage.getItem('profile');
    console.log('save pf: ', savedProfile);
    if (authToken) {
      setIsLogged(true);
      getUserRole();
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch {
          setProfile(null);
        }
      }
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
          // navigate('/');
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

  useEffect(() => {
    console.log('profile update:', profile);
  }, [profile]);

  useEffect(() => {
    if (isLogged) {
      console.log('call api profile');
      getUserRole();
    }
  }, [isLogged]);

  function logout() {
    setIsLogged(false);
    setProfile(null);
    localStorage.clear();
    console.log('handle logout');
  }

  function saveProfile(profileData) {
    setProfile(profileData);
    localStorage.setItem('profile', JSON.stringify(profileData));
  }

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        isLogged,
        setIsLogged,
        logout,
        saveProfile,
        getUserRole,
        role,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
