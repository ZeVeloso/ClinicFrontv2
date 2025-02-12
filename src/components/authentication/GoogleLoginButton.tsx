import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
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
      navigate("/dashboard");
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
