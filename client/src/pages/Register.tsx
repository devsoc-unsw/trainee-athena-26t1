import "./Register.css"
import { Box, Stack, TextField, Checkbox, FormControlLabel, Link, Button } from '@mui/material'

export default function Register() {
  return (
    <div className="registerMainPage">
      <div className="registerBackground">

      </div>

      <div className="registerMaster">
        <Stack spacing={2} sx={{ width: "100%", alignItems: "center" }}>

          <Box className="registerLogo">
            <Box className="registerLogoMeal" sx={{ boxShadow: 6 }}>Meal</Box>
            <Box className="registerLogoMatrix" sx={{ boxShadow: 6 }}>Matrix</Box>
          </Box>

          <Box sx={{ height: 30 }}></Box>

          <TextField className="registerInput" label="Enter your email here" />
          <TextField className="registerInput" label="Enter your password here" />

          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ justifyContent: "space-around", width: "100%", alignItems: "center" }}
          >
            <FormControlLabel control={<Checkbox />} label="Keep me signed in" />
            <Link href="ADD LINK HERE">
              Forgot Password?
            </Link>
          </Stack>

          <Box sx={{ height: 15 }}></Box>

          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ justifyContent: "space-evenly", width: "100%", alignItems: "center" }}
          >
            <Button
              variant="contained"
              sx={{ bgcolor: "green", height: "80px", width: "74%", marginTop: 2 }}
            >
              Register
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}