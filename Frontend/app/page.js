"use client";
import Image from "next/image";
import React from "react";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className=" bg-white">
      <Navbar />
      <div className="container bg-white mx-auto px-12 ">
        <HeroSection />
        <Services />
        <AboutUs />
        <ContactUs />
      </div>
      <Footer />
    </main>
  );
}
