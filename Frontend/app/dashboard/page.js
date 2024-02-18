"use client";
import React from "react";
import Form from "../components/dashboard/form";
import Upload from "../components/dashboard/upload";
import { useSelector } from "react-redux";

function Dashboard() {
  const currentStep = useSelector((state) => state.step.currentStep);

  return (
    <>
      <div>{currentStep === 0 && <Form />}</div>
      <div>{currentStep === 1 && <Upload />}</div>
    </>
  );
}

export default Dashboard;
