import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./Profile.css";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";
import { changePassword } from "../api";
import { getAuth, logout } from "../auth";

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [auth.isLoggedIn, navigate]);

  if (!auth.isLoggedIn) {
    return null;
  }

  async function handleChangePassword() {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await changePassword(currentPassword, newPassword);
      setSuccess(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? "Failed to change password");
      } else {
        setError("Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="profileMainPage">
      <div className="profileBackground"></div>

      <div className="profileMaster">
        <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>
          <Box className="profileLogo">
            <Box className="profileLogoMeal" sx={{ boxShadow: 6 }}>
              Meal
            </Box>
            <Box className="profileLogoMatrix" sx={{ boxShadow: 6 }}>
              Matrix
            </Box>
          </Box>

          <Typography variant="h6" className="profileSectionTitle">
            Your account
          </Typography>
          <Typography className="profileEmail">{auth.email}</Typography>

          <Box sx={{ height: 8 }} />

          <Typography variant="h6" className="profileSectionTitle">
            Change password
          </Typography>

          <TextField
            className="profileInput"
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            className="profileInput"
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            className="profileInput"
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          <Typography variant="caption" sx={{ width: "75%", color: "#666" }}>
            Password must be at least 8 characters with uppercase and lowercase letters.
          </Typography>

          {error && (
            <Typography color="error" sx={{ width: "75%", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" sx={{ width: "75%", textAlign: "center" }}>
              {success}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{ bgcolor: "green", width: "75%", py: 1.5 }}
            onClick={handleChangePassword}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update password"}
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{ width: "75%", py: 1.5 }}
            onClick={handleLogout}
            disabled={loading}
          >
            Log out
          </Button>

          <Link component={RouterLink} to="/" sx={{ width: "75%", textAlign: "center" }}>
            Back to home
          </Link>
        </Stack>
      </div>
    </div>
  );
}
