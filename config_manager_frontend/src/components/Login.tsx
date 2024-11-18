// src/components/Login.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Box, Typography } from "@mui/material";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate Okta login, then redirect
    navigate("/dashboard/get-config");
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Welcome To Config Manager
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          size="large"
        >
          Login by Okta
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
