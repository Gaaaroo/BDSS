import React, { useRef, useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import { getNearbyUsers } from "../services/api/userService";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const containerStyle = { width: "100%", height: "80vh" };
const libraries = ["places"];

function MapView({ initialLocation }) {
  const [mapCenter, setMapCenter] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      const { lat, lng } = initialLocation;
      setMapCenter({ lat, lng });

      // Lấy người dùng gần đó
      getNearbyUsers(lat, lng, 5)
        .then((users) => setNearbyUsers(users))
        .catch((err) => console.error("Lỗi khi lấy user gần đó:", err));
    }
  }, [initialLocation]);

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      {/* Input hiển thị địa chỉ */}
      <input
        type="text"
        value={initialLocation?.address || ""}
        readOnly
        onClick={() => setShowModal(true)}
        placeholder="Địa chỉ"
        className="w-full h-10 px-4 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />

      {/* Modal hiển thị bản đồ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-4xl relative">
            <div>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                onLoad={(map) => {
                  mapRef.current = map;
                  geocoderRef.current = new window.google.maps.Geocoder();
                }}
              >
                {/* Marker xanh của người xung quanh */}
                {nearbyUsers.map((user) => (
                  <Marker
                    key={user.id}
                    position={{ lat: user.lat, lng: user.lng }}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }}
                    onClick={() => setSelectedUser(user)}
                  />
                ))}
                {/* Marker đỏ của chính người dùng (vị trí của họ) */}
                {mapCenter && (
                  <Marker
                    position={mapCenter}
                    icon={{
                      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                  />
                )}

                {/* InfoWindow hiển thị ảnh và tên */}
                {selectedUser && (
                  <InfoWindow
                    position={{ lat: selectedUser.lat, lng: selectedUser.lng }}
                    onCloseClick={() => setSelectedUser(null)}
                  >
                    <div className="text-sm">
                      <img
                        src={selectedUser.image_link}
                        alt={selectedUser.username}
                        className="w-16 h-16 rounded-full mb-1 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://firebasestorage.googleapis.com/v0/b/blooddonationsystem-9f456.appspot.com/o/profile-images%2Fdefault.png?alt=media";
                        }}
                      />
                      <div className="font-semibold">
                        {selectedUser.username}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>

            {/* Nút đóng */}
            <div className="flex justify-end p-4 border-t border-gray-300">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </LoadScript>
  );
}

export default MapView;
