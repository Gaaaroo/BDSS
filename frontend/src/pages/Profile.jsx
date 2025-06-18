import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProfileView from '../components/ProfileView';
import ProfileUpdate from '../components/ProfileUpdate';
import { getUserProfile } from '../services/api/userService';
import { useLocation } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const { saveProfile } = useApp(); //lấy hàm saveProfile từ context
  const fetchUserData = async () => {
    try {
      const data = await getUserProfile();
      saveProfile(data);
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData)
    return <div className="text-center mt-10">Đang tải thông tin...</div>;

  return (
    <div>
      <Navbar />
      {!isEditing && location.state?.flag != 'update' ? (
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
          }}
        />
      )}
    </div>
  );
}
