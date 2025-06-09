import React, { useState, useEffect } from "react";
import MapSelector from "../components/MapSelector";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);

  // Gọi API lấy dữ liệu user khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzYXN1a2UiLCJzY29wZSI6Ik1FTUJFUiIsImlzcyI6ImJkc3MuY29tIiwiZXhwIjoxNzQ5NDQxMjEwLCJpYXQiOjE3NDk0Mzc2MTAsInVzZXJJZCI6MywianRpIjoiNTU5ZGE5NDctMjRiZC00OGE5LWFjYzgtYjQ5OWZiNmY4N2FhIn0.VB2TTfbQa1gBbWtlqSI4uRaWtZF0_N28zteYpmq2GKuXBr4YE_VFE5P5XQUEJuOEK61GTEmfFAOpdw0uJllGyQ";

        const response = await axios.get(
          "http://localhost:8080/bdss/users/myProfile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data.data); // lấy thông tin user từ "data" trong response
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
  };

  if (!userData) {
    return <div className="text-center mt-10">Đang tải thông tin...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl font-sans">
        <div className="grid grid-cols-[37%_60%] gap-10 items-start">
          {/* Left column */}
          <div className="flex flex-col items-center text-center w-full">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-44 h-44 rounded-full object-cover mb-4 border-4 border-blue-700"
              />
              <h2 className="text-4xl font-bold text-blue-700">
                {userData.full_name}
              </h2>
            </div>

            {/* Personal Info */}
            <div className="w-full bg-gray-50 rounded-2xl border p-6 shadow-md text-lg text-left">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Thông tin cá nhân
              </h3>

              <div className="space-y-4">
                <div className="flex">
                  <div className="min-w-[140px] font-semibold text-gray-600">
                    Gender:
                  </div>
                  <div>{userData.gender}</div>
                </div>
                <div className="flex">
                  <div className="min-w-[140px] font-semibold text-gray-600">
                    Date of Birth:
                  </div>
                  <div>{userData.dob}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-full bg-gray-50 rounded-2xl border p-6 shadow-md text-lg h-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Liên hệ
            </h3>

            <div className="space-y-4">
              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Email:
                </div>
                <div>{userData.email}</div>
              </div>

              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Phone:
                </div>
                <div>{userData.phone}</div>
              </div>

              <div className="flex">
                <div className="min-w-[140px] font-semibold text-gray-600">
                  Blood Type:
                </div>
                <div>{userData.blood_type}</div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[140px] font-semibold text-gray-600 mt-2">
                  Address:
                </div>
                <div className="flex-1">
                  <div className="mb-2">{userData.address}</div>
                  <div className="w-full">
                    <MapSelector onLocationSelect={handleLocationSelect} />
                  </div>
                  <input
                    type="hidden"
                    name="latitude"
                    value={location?.lat || ""}
                  />
                  <input
                    type="hidden"
                    name="longitude"
                    value={location?.lng || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
