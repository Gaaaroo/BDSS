import React, { createContext, useState, useContext, useEffect } from 'react';

import { getUserProfile } from '../services/api/userService';
import { useNavigate } from 'react-router';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  //kiểm tra trạng thái đã đăng nhập hay chưa
  const [isLogged, setIsLogged] = useState(false);
  //Để lấy giá trị profile cho 2 form donation & receive
  const [profile, setProfile] = useState();
  //'Staff' 'Admin' 'Member'
  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const [activeWidget, setActiveWidget] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const savedRole = localStorage.getItem('role');
      setIsLogged(true);
      if (savedRole) {
        setRole(savedRole);
      } else {
        fetchUserRole();
      }
    } else {
      setIsLogged(false);
      setProfile(null);
    }
  }, []);

  const fetchUserRole = async () => {
    try {
      const data = await getUserProfile();
      localStorage.setItem('role', data.role);
      setRole(data.role);
    } catch (err) {
      console.log('Error when fetching role:', err);
    } finally {
      setLoadingRole(false);
    }
  };

  const getUserRoleAndNavigate = async () => {
    try {
      const data = await getUserProfile();
      localStorage.setItem('role', data.role);
      setRole(data.role);
      switch (data.role) {
        case 'MEMBER':
          navigate('/');
          break;
        case 'STAFF':
          navigate('/dashboard');
          break;
        case 'ADMIN':
          navigate('/dashboard');
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
      fetchUserRole();
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
        loadingRole,
        getUserRoleAndNavigate,
        role,
        activeWidget,
        setActiveWidget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
