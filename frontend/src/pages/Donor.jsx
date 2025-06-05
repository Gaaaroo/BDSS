import React from "react";
import DonorForm, { Title } from "../components/DonorForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Donor() {
  return (
    <div>
      <Navbar mode="" />
      <Title
        title={"Become a Donor"}
        decription={
          <>
            Donate blood. Save a life. Leave behind a legacy of compassion and
            hope.
            <br />
            Your single act of kindness can bring light to someone’s darkest
            moment, inspire entire communities, and spark a ripple of
            generosity.
            <br />
            Join us in making a real difference. <b>Become a blood donor </b>
            today and help build a healthier, more caring world for all.
          </>
        }
      />
      <div className="flex-1 flex flex-col justify-center">
        <DonorForm />
      </div>
      <Footer />
    </div>
  );
}
