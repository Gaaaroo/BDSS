import React from 'react';
import img from '../assets/images/cover-photo.jpg';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Contexts/AppContext';
export default function Banner() {
  const navigate = useNavigate();
  const { isLogged } = useApp();
  const [showModal, setShowModal] = React.useState(false);
  const handleBloodButtonClick = () => {
    navigate('/blood-compatibility');
  };
  const handleDonorRegister = () => {
    if (!isLogged) {
      setShowModal(true);
      return;
    }
    navigate('/become-a-donor');
  };
  const handleSeekerRegister = () => {
    if (!isLogged) {
      setShowModal(true);
      return;
    }
    navigate('/become-a-seeker');
  };
  return (
    <div className="relative w-full h-[450px] overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-10"></div>
      <img src={img} alt="banner" className="w-full h-[450px] object-cover " />
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-3xl md:text-5xl text-center mb-20">
          "The joy of saving lives is in your veins. Donate blood."
        </h1>
        <div className="flex space-x-60 mb-8">
          <button
            className="bg-gray-100 text-black text-[20px] px-4 py-2 rounded-3xl shadow font-bold w-52 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
            onClick={handleDonorRegister}
          >
            Become a Donor
          </button>
          <button
            className="bg-gray-100 text-black text-[20px] px-4 py-2 rounded-3xl shadow font-bold w-52 transform transition-transform duration-200 hover:scale-110 cursor-pointer"
            onClick={handleSeekerRegister}
          >
            Become a Seeker
          </button>
        </div>
        <button
          className="bg-gray-100 text-black text-[20px] px-4 py-2 rounded-3xl shadow font-bold w-52 transform transition-transform duration-200 hover:scale-110 mt-4 cursor-pointer"
          onClick={handleBloodButtonClick}
        >
          Blood Suitability 
        </button>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-start justify-center z-50 backdrop-brightness-50"
          onClick={() => setShowModal(false)} // Click outside closes modal
        >
          <div
            className="relative bg-white rounded-lg p-6 w-150 shadow-lg m-10"
            onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
          >
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h1 className="text-2xl font-bold text-red-700 mb-4">
              Please Login!
            </h1>
            <p className="text-gray-700 mb-2 text-justify">
              "Oops! Looks like you're not logged in yet. Please log in to
              continue registering - we promise it’ll only take a moment!"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
