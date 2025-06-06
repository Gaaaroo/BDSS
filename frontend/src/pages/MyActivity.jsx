import React from "react";
import Navbar from "../components/Navbar";
import History from "../components/History";
import DonationProgress from "../components/DonationProgress";
import ReceptionProgress from "../components/ReceptionProgress";
import img from "../assets/images/cover-photo.jpg";

export function BannerMyActivity() {
  return (
    <div>
      <img src={img} alt="banner" className="w-full h-40 object-cover " />
    </div>
  );
}

export default function MyActivity() {
  // History ===>> Blood Donation / Blood Reception
  // Donation Request Blood Progress
  // Reception Request Blood Progress

  const [activeTab, setActiveTab] = React.useState("donation");

  return (
    <div>
      <Navbar mode="" />
      <BannerMyActivity />
      <div className="flex gap-4 my-4 justify-start px-10 h-12">
        <button
          className={`px-6 py-2 shadow transition rounded-md ${
            activeTab === "donation"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-red-500 border border-red-500 hover:bg-red-100"
          }`}
          onClick={() => setActiveTab("donation")}
        >
          Donation Request Blood Progress
        </button>
        <button
          className={`px-6 py-2 shadow transition rounded-md ${
            activeTab === "reception"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-100"
          }`}
          onClick={() => setActiveTab("reception")}
        >
          Reception Request Blood Progress
        </button>
        <button
          className={`px-6 py-2 shadow transition rounded-md ${
            activeTab === "history"
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-white text-gray-500 border border-gray-400 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>
      <div>
        {activeTab === "donation" && <DonationProgress />}
        {activeTab === "reception" && <ReceptionProgress />}
        {activeTab === "history" && <History />}
      </div>
    </div>
  );
}
