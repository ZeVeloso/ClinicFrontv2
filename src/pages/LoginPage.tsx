import React, { useState } from "react";
import { login } from "../api/auth";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Link,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import GoogleLoginButton from "../components/authentication/GoogleLoginButton";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { PUBLIC_PATHS } from "../config/navigationConfig";
import clinicLogo from "../assets/Clinic+.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAccessToken } = useAuth();
  const { toDashboard } = useAppNavigation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      toDashboard();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f7fb",
        "& .MuiTextField-root": {
          position: "relative",
          "& input:-webkit-autofill": {
            "-webkit-box-shadow": "0 0 0 100px #fff inset",
            "-webkit-text-fill-color": "inherit",
            transition: "background-color 5000s ease-in-out 0s",
          },
          "& .MuiInputLabel-root": {
            backgroundColor: "background.paper",
            px: 0.5,
          },
        },
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Box
            component="img"
            src={clinicLogo}
            alt="Clinic+"
            sx={{
              height: 50,
              mb: 2,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              mb: 3,
            }}
          >
            Welcome Back
          </Typography>

          {error && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 1, mb: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ mt: 1, mb: 3 }}>
              <GoogleLoginButton />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              href={PUBLIC_PATHS.SIGNUP}
              variant="body2"
              underline="hover"
              sx={{ fontWeight: 500 }}
            >
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
