import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [profile, setProfile] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const savedProfile = localStorage.getItem('profile');
    console.log('save pf: ', savedProfile);
    if (authToken) {
      setIsLogged(true);
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

  useEffect(() => {
    console.log('profile update:', profile);
  }, [profile]);

  function logout() {
    setIsLogged(false);
    setProfile(null);
    navigate('/');
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
