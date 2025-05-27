import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black py-5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-20">
        <div>
          <h3 className="text-lg font-semibold mb-2">LOCATIONS</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold">FPT UNIVERSITY HCM</p>
              <p>FPT University, Ho Chi Minh City Campus</p>
              <p>Lot E2a-7, D1 Street, Saigon Hi-Tech Park</p>
              <p>Long Thanh My Ward, Thu Duc City, Ho Chi Minh City, Vietnam</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">MEMBER OF MY TEAM</h3>
          <ul className="space-y-2">
            <li>Nguyen Duc Huynh</li>
            <li>Nguyen Minh Chau</li>
            <li>Vo Viet Minh Duc</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">CONTACT US</h3>
          <ul className="space-y-2 text-sm">
            <li>PHONE: 650-723-7831</li>
            <li>TOLL-FREE: 888-723-7831</li>
            <li>EMAIL US: abc@fpt.edu.vn </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-sm text-center">
        <p>
          Thank you for your interest in donating blood. Your donation is
          important to us.
        </p>
        <p>
          We are committed to protecting your privacy and personal information.
        </p>
        <p>
          We will not share your information with any third parties without your
          consent.
        </p>
        <p>
          We will only use your information to contact you about your donation
          and to provide you with information.
        </p>
        <p className="mt-2">
          ©2025 Blood Donation Support System - SWP Project, FPT University.
        </p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
