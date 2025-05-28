import React from "react";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/Aboutsection";
import { Sliders } from "lucide-react";
import ImageCarousel from "../components/Slider";
import HowItWorkSection from "../components/HowItWorkSection";
import BlogSection from "../components/BlogSection";

export default function Home() {
  return (
    <>
      <Navbar showMenu={true} />
      <Banner />
      <AboutSection />

      <HowItWorkSection />
      <BlogSection />
      <Footer />

      {/* <Footer /> */}
    </>
  );
}
