import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileView from "../components/ProfileView";
import ProfileUpdate from "../components/ProfileUpdate";
import { getUserProfile } from "../services/api/userService";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHYWFyb29vIiwic2NvcGUiOiJBRE1JTiIsImlzcyI6ImJkc3MuY29tIiwiZXhwIjoxNzQ5NTM4MTU3LCJpYXQiOjE3NDk1MzQ1NTcsInVzZXJJZCI6MSwianRpIjoiMTVkOGQwNGUtZDkxZC00MDZjLTk5ZjAtNTA2MWYwYWFjMWQ1In0.9Is6EcnIBj_evfDq7U5KypDmng9zq9g1d8kxFvRDvG2AUz35tDlKV2peu1T-akv_k8Pd_I2bPezVQWY2aHCSsw";

  const fetchUserData = async () => {
    try {
      const data = await getUserProfile(token);
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
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
      {!isEditing ? (
        <ProfileView
          userData={userData}
          onEditClick={() => setIsEditing(true)}
        />
      ) : (
        <ProfileUpdate
          initialData={userData}
          token={token}
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
