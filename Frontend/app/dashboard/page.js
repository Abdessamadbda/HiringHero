"use client";
import React, { useEffect } from "react";
import Form from "../components/dashboard/form";
import Upload from "../components/dashboard/upload";
import { useSelector } from "react-redux";
import { getSession } from "next-auth/client";
import { useRouter } from "next/navigation";


async function Dashboard() {
  const router = useRouter();

  const currentStep = useSelector((state) => state.step.currentStep);
  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (!session) {
        router.push("/signin");
      }
    }
    checkSession();
  }, []);
  return (
    <>
      <div>{currentStep === 0 && <Form />}</div>
      <div>{currentStep === 1 && <Upload />}</div>
    </>
  );
}

export default Dashboard;
