import React from "react";

const AboutSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center text-justify pt-10 px-10 bg-white">
      <div className="md:w-1/2 w-full flex justify-center mb-8 md:mb-0 border-r-4 border-red-700">
        <img
          src="https://img.freepik.com/premium-vector/donating-blood-donation-bag-blood-donor-hemolytic-transfusion-bank-save-patient-live-hematology-clinical-laboratory-analysis-patient-support-charity-volunteering_284092-2672.jpg"
          alt="Blood donation"
          className="w-200 h-120 object-cover"
        />
      </div>

      <div className="md:w-1/2 w-full md:pl-12 text-xl">
        <h2 className="text-4xl font-bold text-red-700 mb-3">About Us</h2>
        <p className="text-gray-700 mb-3">
          BDSS (Blood Donation Support System) is committed to bridging the gap
          between blood donors and recipients. Our platform streamlines the
          process, making it easier and faster for those in need to find
          lifesaving support.
        </p>
        <p className="text-gray-700 mb-3">
          Our mission is to foster a compassionate community where donating
          blood is simple, accessible, and impactful. We leverage technology to
          ensure a seamless experience for both donors and recipients,
          prioritizing safety and reliability.
        </p>
        <p className="text-gray-700 mb-3">
          By joining BDSS, you become part of a movement dedicated to saving
          lives and supporting those facing medical emergencies. Every donation
          counts, and together, we can make a significant difference.
        </p>
        <p className="text-gray-700">
          Join us in our mission to make blood donation a cornerstone of
          community support. Your contribution matters one donation at a time.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
