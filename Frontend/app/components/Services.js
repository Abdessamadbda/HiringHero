import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Lottie from "lottie-react";
import Animation1 from "../../public/Animation1.json";
import Animation2 from "../../public/Animation2.json";
import Animation3 from "../../public/Animation3.json";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "CV Screening",
    description:
      "Efficiently filter through resumes to identify top-tier candidates for your job openings.",
    animationData: Animation1,
  },
  {
    name: "LinkedIn Sharing:",
    description:
      "Seamlessly share curated candidate profiles on LinkedIn, maximizing your reach and networking potential.",
    animationData: Animation2,
  },
  {
    name: "Relevant LinkedIn Profile Suggestions:",
    description:
      "Receive targeted recommendations for LinkedIn profiles that align with your recruitment needs, ensuring you connect with the most suitable talent.",
    animationData: Animation3,
  },
];
function Services() {
  return (
    <div id="services">
      <h2 className="font-body-proxima-nova text-3xl text-center sm:text-left font-bold mb-16 ml-16 mt-16">
        Our Services
      </h2>

      <div className="py-24 sm:py-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <Card
                  key={feature.name}
                  className="relative flex items-center py-4 px-6 border border-gray-200 rounded-lg shadow-md"
                >
                  <div className="mr-4 flex items-center justify-center rounded-full h-16 w-16">
                    <Lottie
                      animationData={feature.animationData}
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                  <div>
                    <CardHeader className="font-semibold text-gray-900">
                      {feature.name}
                    </CardHeader>
                    <CardBody className="text-sm text-gray-600">
                      {feature.description}
                    </CardBody>
                  </div>
                </Card>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
