import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { requestPasswordReset } from "@api/auth";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Check your email
          </Typography>
          <Typography color="text.secondary">
            We've sent password reset instructions to {email}
          </Typography>
          <Button sx={{ mt: 3 }} onClick={() => navigate("/login")}>
            Return to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Reset your password
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              type="email"
            />
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
              Send reset instructions
            </Button>
          </form>
          <Button fullWidth onClick={() => navigate("/login")} sx={{ mt: 2 }}>
            Back to login
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
