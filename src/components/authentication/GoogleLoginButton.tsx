import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";

const GoogleLoginButton: React.FC = () => {
  const { toDashboard } = useAppNavigation();
  const { setAccessToken } = useAuth();

  const handleSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    const response = await googleLogin(token);
    const { accessToken } = response.data;

    try {
      setAccessToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      //localStorage.setItem('refreshToken', data.refreshToken);
      // Redirect or update UI as needed
      toDashboard();
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleFailure = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
