import React from "react";
import Lottie from "lottie-react";
import Link from "next/link";

function HeroSection() {
  return (
    <div
      className="flex space-x-12 flex-col lg:flex-row  lg:space-y-0 "
      id="home"
    >
      <div className="text-left lg:py-32 py-32">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl ">
          Unveil exceptional talents and streamline your recruitment journey.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          From CV filtering to LinkedIn sharing, we make hiring a breeze.
          Navigate through the world of talent effortlessly at HiringHero –
          where finding the right fit is as simple as a click.
        </p>
        <div className="mt-10 flex items-center justify-left gap-x-6">
          <Link
            href="/signin"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </Link>
          <a
            href="#aboutus"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            About Us<span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="w-full max-w-lg lg:mx-0 lg:py-32 flex items-center justify-center">
        <Lottie
          animationData={require("../../public/Animation.json")}
          loop={true}
          autoplay={true}
        />
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}

export default HeroSection;
