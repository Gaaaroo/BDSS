import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProfileView from '../components/ProfileView';
import ProfileUpdate from '../components/ProfileUpdate';
import { getUserProfile } from '../services/api/userService';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const redirectTo = location.state?.redirectTo;
  const navigate = useNavigate();
  const fetchUserData = async () => {
    try {
      const data = await getUserProfile();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <Navbar />
      {!isEditing && location.state?.flag !== 'update' ? (
        <ProfileView
          userData={userData}
          onEditClick={() => setIsEditing(true)}
        />
      ) : (
        <ProfileUpdate
          initialData={userData}
          onCancel={() => setIsEditing(false)}
          onSaveSuccess={() => {
            setIsEditing(false);
            fetchUserData();
            if (redirectTo) {
              navigate(redirectTo);
            }
          }}
        />
      )}
    </div>
  );
}
