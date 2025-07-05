import React, { useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import { getNearbyUsers } from '../services/api/userService';

// Kích thước bản đồ hiển thị
const containerStyle = {
  width: '100%',
  height: '80vh',
};

// Tọa độ trung tâm mặc định (TP. Hồ Chí Minh)
const defaultCenter = {
  lat: 10.776889,
  lng: 106.700806,
};

function MapSelector({ onLocationSelect, initialLocation }) {
  // Trạng thái lưu vị trí marker
  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [showModal, setShowModal] = useState(false);
  const [addressText, setAddressText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  // Ref cho map, autocomplete và geocoder
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      const { lat, lng, address } = initialLocation;
      const location = { lat, lng };

      setMarker(location);
      setMapCenter(location);
      setSelectedLocation({ lat, lng, address });
      setAddressText(address || '');
    }
  }, [initialLocation]);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    // Di chuyển bản đồ đến vị trí mới
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);

    // Ghim marker tại vị trí đã chọn
    setMarker({ lat, lng });
    setMapCenter({ lat, lng });
    setAddressText(address);
    setSelectedLocation({ lat, lng, address });

    // Truyền dữ liệu lên cha
    onLocationSelect({ lat, lng, address: place.formatted_address });
    // Gọi API lấy danh sách người dùng gần đó
    getNearbyUsers(lat, lng, 5)
      .then((users) => setNearbyUsers(users))
      .catch((err) => console.error('Lỗi khi lấy user gần đó:', err));
  };

  // Xử lý khi người dùng click trực tiếp lên bản đồ
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const location = { lat, lng };

    setMarker(location);
    setMapCenter(location);
    onLocationSelect(location);

    // Dùng Geocoder để lấy địa chỉ từ tọa độ
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setAddressText(address);
          setSelectedLocation({ lat, lng, address });
          // Cập nhật input search nếu tìm được địa chỉ
          const input = document.querySelector('#search-input');
          if (input) input.value = address;
          // Gọi API lấy danh sách người dùng gần đó
          getNearbyUsers(lat, lng, 5)
            .then((users) => setNearbyUsers(users))
            .catch((err) => console.error('Lỗi khi lấy user gần đó:', err));
        }
      });
    }
  };

  const handleClose = () => {
    if (selectedLocation) {
      setAddressText(selectedLocation.address); // Đảm bảo input luôn đúng
      onLocationSelect(selectedLocation); // Gửi dữ liệu về cha
    }
    setShowModal(false);
  };

  return (
    <>
      <input
        type="text"
        value={addressText}
        onClick={() => setShowModal(true)}
        readOnly
        placeholder="Nhấp để chọn địa chỉ..."
        className="w-full h-10 px-4 text-black placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      />

      {/* Modal chứa bản đồ và tìm kiếm địa chỉ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-4xl relative">
            {/* Ô tìm kiếm địa chỉ (autocomplete) */}
            <div className="p-4 border-b border-gray-300">
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  id="search-input"
                  type="text"
                  placeholder="Tìm kiếm địa chỉ..."
                  className="w-full h-10 px-4 bg-white text-black border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
              </Autocomplete>
            </div>

            {/* Google Map */}
            <div>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={14}
                onClick={handleMapClick} // Click để chọn vị trí
                onLoad={(map) => {
                  mapRef.current = map;
                  geocoderRef.current = new window.google.maps.Geocoder();
                }}
              >
                {/* Marker của (người đang chọn vị trí) */}
                {marker && (
                  <Marker
                    key={'marker'}
                    position={marker}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // đỏ
                    }}
                  />
                )}

                {/* Marker của người xung quanh (màu xanh) */}
                {nearbyUsers.map((user, idx) => (
                  <Marker
                    key={idx}
                    position={{ lat: user.lat, lng: user.lng }}
                    icon={{
                      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // xanh
                    }}
                  />
                ))}
              </GoogleMap>
            </div>

            {/* Nút đóng modal */}
            <div className="flex justify-end p-4 border-t border-gray-300">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MapSelector;
