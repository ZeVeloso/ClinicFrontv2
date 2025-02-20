import React, { useState } from "react";
import { signup } from "../api/auth";
import { handleError } from "../utils/errorHandler";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Link,
  Paper,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Divider,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { PUBLIC_PATHS } from "../config/navigationConfig";
import clinicLogo from "../assets/Clinic+.png";
import { useAppNavigation } from "../hooks/useAppNavigation";
const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { toLogin } = useAppNavigation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signup({ name, email, password });
      toLogin();
    } catch (err: any) {
      setError(handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
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
      <Container component="main" maxWidth="sm">
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
              mb: 1,
            }}
          >
            Create an Account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            Join our healthcare platform to manage your medical records and
            appointments
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

          <Box
            component="form"
            onSubmit={handleSignup}
            autoComplete="off"
            sx={{
              width: "100%",
              "& .MuiFormControl-root": {
                mb: 2,
              },
            }}
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="name">Full Name</InputLabel>
              <OutlinedInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Full Name"
                required
                autoComplete="off"
                sx={{ borderRadius: 2 }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                required
                autoComplete="off"
                sx={{ borderRadius: 2 }}
              />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                required
                autoComplete="new-password"
                sx={{ borderRadius: 2 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="large"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl
              fullWidth
              variant="outlined"
              error={!!confirmPasswordError}
            >
              <InputLabel htmlFor="confirm-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                label="Confirm Password"
                required
                sx={{ borderRadius: 2 }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="large"
                      sx={{ color: "text.secondary" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {!!confirmPasswordError && (
                <FormHelperText>{confirmPasswordError}</FormHelperText>
              )}
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{" "}
              <Link
                href={PUBLIC_PATHS.LOGIN}
                underline="hover"
                sx={{ fontWeight: 500 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
