"use client";
import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import store from "../lib/store";
import Layout1 from "../components/dashboard/layout";
import Stepper from "../components/dashboard/stepper";
import axios from "axios";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setTokenValid] = useState(false);

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

  // If loading, display loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If token is not valid, don't render anything and redirect user to sign-in page
  if (!isTokenValid) {
    return null;
  }

  // Render layout with children
  return (
    <Provider store={store}>
      <Layout1 />
      <Stepper />
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-white">
        {children}
      </div>
    </Provider>
  );
};

export default Layout;
