import React from "react";
import img from "../assets/images/cover-photo.jpg";
export default function Banner() {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div className="absolute inset-0 bg-white opacity-10"></div>
      <img src={img} alt="banner" className="w-full h-96 object-cover " />
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-3xl md:text-5xl text-center mb-20">
          "The joy of saving lives is in your veins. Donate blood."
        </h1>
        <div className="flex space-x-64 mb-4">
          <button className="bg-gray-100 text-black text-[20px] px-4 py-2 rounded-3xl shadow font-bold transform transition-transform duration-200 hover:scale-110 w-[200px]">
            Become a Donor
          </button>
          <button className="bg-gray-100 text-black text-[20px] px-4 py-2 rounded-3xl shadow font-bold transform transition-transform duration-200 hover:scale-110 w-[200px]">
            Become a Seeker
          </button>
        </div>
        <button className="bg-gray-100 text-black text-[20px] px-4 py-2 rounded-3xl shadow font-bold transform transition-transform duration-200 hover:scale-110 w-[200px]">
          Blood type
        </button>
      </div>
    </div>
  );
}
