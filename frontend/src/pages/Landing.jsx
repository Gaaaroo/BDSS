import React, { useEffect } from "react";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import ImageCarousel from "../components/Slider";
import HowItWorkSection from "../components/HowItWorkSection";
import BlogSection from "../components/BlogSection";

import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";

export default function Home() {
  const [isLogin, setIsLogin] = React.useState("no");
  const handleLogout = () => setIsLogin("yes");

  useEffect(() => {
    Events.scrollEvent.register("begin", (to, element) => {
      console.log("begin", to, element);
    });
    Events.scrollEvent.register("end", (to, element) => {
      console.log("end", to, element);
    });
    scrollSpy.update();
    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar isLogin={isLogin} onLogout={handleLogout} />
      </div>
      <Element name="top">
        <Banner />
      </Element>
      <Element name="about">
        <AboutSection />
      </Element>
      <Element name="howitworks">
        <HowItWorkSection />
      </Element>
      <Element name="carousel">
        <ImageCarousel />
      </Element>
      <Element name="blogs">
        <BlogSection />
      </Element>
      <Footer />
    </>
  );
}
