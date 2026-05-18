import "./Login.css"
import { Box, Stack, TextField, Checkbox, FormControlLabel, Link, Button } from '@mui/material'

export default function Login() {
  return (
    <div className="mainPage">
      <div className="loginBackground">

      </div>
      <div className="loginMaster">
        <Stack spacing={2} sx={{width: "100%", alignItems: "center"}}>
          <Box className="logo" >
            <Box className="logoMeal" sx={{boxShadow: 6}}>Meal</Box>
            <Box className="logoMatrix" sx={{boxShadow: 6}}>Matrix</Box>
          </Box>
          <Box sx={{height: 30}}></Box>
          <TextField id="outlined-basic" className="input" label="Enter your email here"></TextField>
          <TextField id="outlined-basic" className="input" label="Enter your password here"></TextField>
          <Stack direction={{xs: "column", md:"row"}} sx={{justifyContent:"space-around", width:"100%", alignItems:"center"}}>
            <FormControlLabel control={<Checkbox/>} label="Keep me signed in" />
            <Link href="ADD LINK HERE">
              Forgot Password?
            </Link>
          </Stack>
          <Box sx={{height: 15}}></Box>
          <Stack direction={{xs: "column", md:"row"}} sx={{justifyContent: "space-evenly", width:"100%", alignItems:"center"}}>
            <Button variant="contained" sx={{bgcolor:"green", height:"80px", width:{xs:"80%", md:"31%"}, marginTop:2}}>Login</Button>
            <Button variant="contained" sx={{bgcolor:"red", height:"80px", width:{xs:"80%", md:"31%"}, marginTop:2}} href="/">Cancel</Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
} 