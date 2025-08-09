import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      const role = localStorage.getItem("role");

      switch (role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "MANAGER":
          navigate("/manager");
          break;
        case "CHEF":
          navigate("/chef");
          break;
        case "USER":
          navigate("/user");
          break;
        default:
          navigate("/unauthorized");
          break;
      }
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* Animated Gradient Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          background:
            "linear-gradient(-45deg, #d2dcc7ff, #8cb78eff, #648199ff, #8d6c3cff)",
          backgroundSize: "400% 400%",
          animation: "gradientBG 15s ease infinite",
        }}
      />
      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>

      {/* App Title */}
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "white",
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        }}
      >
        Welcome to HostelGrid
      </Typography>

      {/* Login Card */}
      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            <LockIcon sx={{ fontSize: 40, mb: 1 }} />
            <br />
            Login
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                backgroundColor: "#4caf50",
                ":hover": { backgroundColor: "#388e3c" },
              }}
            >
              Login
            </Button>
          </Box>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1, cursor: "pointer", color: "#04192fff" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
}
