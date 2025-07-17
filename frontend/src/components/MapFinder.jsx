import React, { useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  Autocomplete,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import {
  getNearbyUsersWithBloodType,
  sendInviteRequest,
} from '../services/api/userService';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

const fallbackLocation = {
  lat: 10.776889,
  lng: 106.700806,
};

export default function MapFinder({ onClose, initialLocation }) {
  const [mapCenter, setMapCenter] = useState(
    initialLocation || fallbackLocation
  );

  const [marker] = useState(initialLocation || null);

  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [addressText, setAddressText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [directions, setDirections] = useState(null);
  const [distanceText, setDistanceText] = useState('');
  const [bloodType, setBloodType] = useState('');

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (
      initialLocation?.lat &&
      initialLocation?.lng &&
      initialLocation?.address
    ) {
      setAddressText(initialLocation.address);
    }
  }, [initialLocation]);

  // const fetchNearbyUser = (lat, lng) => {
  //   getNearbyUsers(lat, lng, searchRadius)
  //     .then((users) => setNearbyUsers(users))
  //     .catch((err) => console.error('Lỗi khi lấy user gần đó:', err));
  // };

  const fetchNearbyUsersWithBloodType = (lat, lng) => {
    getNearbyUsersWithBloodType(lat, lng, searchRadius, bloodType)
      .then((users) => setNearbyUsers(users))
      .catch((err) => console.error('Lỗi khi lấy user gần đó:', err));
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const location = { lat, lng };
    setMapCenter(location);
    setSelectedLocation(location);
    mapRef.current.panTo(location);
    mapRef.current.setZoom(16);

    //fetchNearbyUsers(lat, lng);
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const location = { lat, lng };

    setMapCenter(location);
    setSelectedLocation(location);

    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setAddressText(address);
          if (inputRef.current) inputRef.current.value = address;

          //fetchNearbyUsers(lat, lng);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-[75vw] max-w-8xl relative">
        {/* Tìm kiếm + Bán kính + Nút Search */}
        <div className="p-4 border-b border-gray-300 flex gap-4 items-center">
          <div className="flex-1">
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                placeholder="Tìm kiếm địa chỉ..."
                defaultValue={addressText}
                className="w-full h-10 px-4 bg-white text-black border border-black rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </Autocomplete>
          </div>
          <input
            type="number"
            min={1}
            max={50}
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
            className="w-28 h-10 px-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bán kính (km)"
          />
          {/* Blood Type select */}
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-32 h-10 px-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả nhóm máu</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <button
            onClick={() => {
              if (marker) {
                fetchNearbyUsersWithBloodType(marker.lat, marker.lng);
                mapRef.current?.panTo(marker);
                setMapCenter(marker); // cập nhật lại bản đồ
                setSelectedLocation(null); // bỏ marker vàng nếu có
                setSelectedUser(null); // đóng InfoWindow nếu đang mở
              }
            }}
            className="h-10 px-4 text-white bg-red-500 rounded hover:bg-red-700"
          >
            Search
          </button>
        </div>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={14}
          onLoad={(map) => {
            mapRef.current = map;
            geocoderRef.current = new window.google.maps.Geocoder();
          }}
          onClick={handleMapClick} // Click để chọn vị trí
        >
          {/* Marker ĐỎ: vị trí user ban đầu */}
          {marker && (
            <Marker
              position={marker}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />
          )}

          {/* Marker VÀNG: vị trí được chọn mới (click hoặc search) */}
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
              }}
            />
          )}

          {/* Marker XANH: người dùng gần đó */}
          {nearbyUsers.map((user, idx) => (
            <Marker
              key={idx}
              position={{ lat: user.lat, lng: user.lng }}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
              }}
              onClick={() => {
                setSelectedUser(user);

                if (marker) {
                  const origin = marker;
                  const destination = { lat: user.lat, lng: user.lng };

                  const directionsService =
                    new window.google.maps.DirectionsService();
                  directionsService.route(
                    {
                      origin,
                      destination,
                      travelMode: window.google.maps.TravelMode.DRIVING,
                    },
                    (result, status) => {
                      if (status === 'OK') {
                        setDirections(result);
                        const distance =
                          result.routes[0]?.legs[0]?.distance?.text ||
                          'Không rõ';
                        setDistanceText(distance);
                      } else {
                        console.error(
                          'Directions request failed due to ' + status
                        );
                      }
                    }
                  );
                }
              }}
            />
          ))}
          {/* InfoWindow cho user được click */}
          {selectedUser && (
            <InfoWindow
              position={{ lat: selectedUser.lat, lng: selectedUser.lng }}
              onCloseClick={() => {
                setSelectedUser(null);
                setDirections(null);
                setDistanceText('');
              }}
            >
              <div className="flex flex-col items-center p-4 w-48">
                <img
                  src={
                    selectedUser.imageLink?.trim()
                      ? selectedUser.imageLink
                      : 'https://firebasestorage.googleapis.com/v0/b/blooddonationsystem-9f456.firebasestorage.app/o/profile-images%2Fmbqqs93k-avatar.webp?alt=media&token=6b9ef0c4-72dc-45e2-9eed-73c64e236d3d'
                  }
                  alt={selectedUser?.username || 'user'}
                  className="w-24 h-24 rounded-full object-cover shadow-md mb-3 border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://firebasestorage.googleapis.com/v0/b/blooddonationsystem-9f456.firebasestorage.app/o/profile-images%2Fmbqqs93k-avatar.webp?alt=media&token=6b9ef0c4-72dc-45e2-9eed-73c64e236d3d';
                  }}
                />
                <div className="w-full text-sm text-gray-800 font-semibold space-y-1">
                  <div className="flex">
                    <div className="text-right pr-2">Username :</div>
                    <div>{selectedUser?.username}</div>
                  </div>
                  <div className="flex">
                    <div className="text-right pr-2">Blood Type :</div>
                    <div>{selectedUser?.bloodType}</div>
                  </div>
                  <div className="flex">
                    <div className="text-right pr-2">Phone :</div>
                    <div>{selectedUser?.phone}</div>
                  </div>
                  <div className="flex">
                    <div className="text-right pr-2">Distance :</div>
                    <div>{distanceText}</div>
                  </div>
                </div>
                <button
                  onClick={() => sendInviteRequest(selectedUser.userId)}
                  className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                >
                  Invite to donate
                </button>
              </div>
            </InfoWindow>
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {/* Nút đóng */}
        <div className="flex justify-end p-4 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
