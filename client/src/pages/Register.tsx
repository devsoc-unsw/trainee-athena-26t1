import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Register.css";
import {
  Box,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { registerUser } from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    setError("");
    setLoading(true);
    try {
      await registerUser(email, password);
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="registerMainPage">
      <div className="registerBackground"></div>

      <div className="registerMaster">
        <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
          <Box className="registerLogo">
            <Box className="registerLogoMeal" sx={{ boxShadow: 6 }}>Meal</Box>
            <Box className="registerLogoMatrix" sx={{ boxShadow: 6 }}>Matrix</Box>
          </Box>

          <Box sx={{ height: 30 }}></Box>

          <TextField
            className="registerInput"
            label="Enter your email here"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            className="registerInput"
            label="Enter your password here"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ justifyContent: "space-between", width: "75%", alignItems: "center" }}
          >
            <FormControlLabel control={<Checkbox />} label="Keep me signed in" />
            <Link component={RouterLink} to="/login">
              Already have an account? Log in
            </Link>
          </Stack>

          {error && (
            <Typography color="error" sx={{ width: "75%", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <Box sx={{ height: 15 }} />

          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ justifyContent: "space-evenly", width: "100%", alignItems: "center" }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "green", height: "80px", width: "75%", marginTop: 2 }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}
