import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Login.css";
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
import { loginUser } from "../api";
import { setAuth } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      setAuth(data, keepSignedIn);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mainPage">
      <div className="loginBackground"></div>

      <div className="loginMaster">
        <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
          <Box className="logo">
            <Box className="logoMeal" sx={{ boxShadow: 6 }}>
              Meal
            </Box>
            <Box className="logoMatrix" sx={{ boxShadow: 6 }}>
              Matrix
            </Box>
          </Box>

          <Box sx={{ height: 30 }}></Box>

          <TextField
            className="input"
            label="Enter your email here"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            className="input"
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Keep me signed in"
            />
            <Link component={RouterLink} to="/register">
              Don&apos;t have an account? Register
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
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}
