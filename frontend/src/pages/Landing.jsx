import React, { useEffect } from "react";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import ImageCarousel from "../components/Slider";
import HowItWorkSection from "../components/HowItWorkSection";
import BlogSection from "../components/BlogSection";

import { Link, Element, Events, scrollSpy } from "react-scroll";
import WidgetChat from "../components/WidgetChat";

export default function Home() {
  const [isLogin, setIsLogin] = React.useState(false);
  const [mode, setMode] = React.useState("guest");

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken != "" && savedToken != null) {
      setIsLogin(true);
      setMode("member");
    } else {
      setIsLogin(false);
      setMode("guest");
    }

    console.log(savedToken); // Logs the token

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
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar mode={mode} />
      </div>
      <div className="pt-16">
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
      </div>
      <WidgetChat />
    </>
  );
}
