"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Form from "../components/dashboard/form";
import Upload from "../components/dashboard/upload";
import { Provider } from "react-redux";
import store from "../lib/store";
function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setTokenValid] = useState(false);
  const currentStep = useSelector((state) => state.step.currentStep);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If token is not found, redirect user to sign-in page
      router.push("/signin");
    } else {
      // If token is found, verify its validity by sending a request to the server
      axios
        .get("http://localhost:8080/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // If the token is valid, set the state accordingly
          setTokenValid(true);
        })
        .catch((error) => {
          // If the token is invalid or expired, redirect user to sign-in page
          console.error("Error verifying token:", error);
          router.push("/signin");
        })
        .finally(() => {
          // Set loading to false once token validation is complete
          setLoading(false);
        });
    }
  }, []);

  // Handle logout
  

  // Render loading indicator if loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If token is not valid, don't render anything and redirect user to sign-in page
  if (!isTokenValid) {
    return null;
  }

  // Render components based on token validity
  return (
    <Provider store={store}>
      <div>
        <div>{currentStep === 0 && <Form />}</div>
        <div>{currentStep === 1 && <Upload />}</div>
       
      </div>
    </Provider>
  );
}

export default Dashboard;
