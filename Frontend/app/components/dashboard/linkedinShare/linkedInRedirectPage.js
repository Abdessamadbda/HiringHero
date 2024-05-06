import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function LinkedInRedirectPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Parse the URL to extract the authorization code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Send the authorization code to your server to exchange for an access token
    if (code) {
      dispatch({ type: "EXCHANGE_CODE_FOR_ACCESS_TOKEN", payload: code });
    }
  }, [dispatch]);

  return <div>Redirecting...</div>;
}
