import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProfileView from '../components/ProfileView';
import ProfileUpdate from '../components/ProfileUpdate';
import { getUserProfile } from '../services/api/userService';
import { LoadScript } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  // Thư viện cần load thêm từ Google (autocomplete)
  const libraries = ['places'];
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

  if (!userData)
    return <div className="text-center mt-10">Đang tải thông tin...</div>;

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries} />

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
