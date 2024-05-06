import React from "react";

export default function LinkedInAuthButton() {
  const handleLinkedInAuth = () => {
    const clientId = "YOUR_CLIENT_ID";
    const redirectUri = "YOUR_REDIRECT_URI";
    const scope = "w_member_social"; // Scope for sharing content

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    // Redirect the user to LinkedIn's authorization endpoint
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLinkedInAuth}>Authenticate with LinkedIn</button>
  );
}
