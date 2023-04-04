
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { Box, TextField, Button, Typography, Link } from '@mui/material';

/**
 * SignUp component for user registration.
 * @returns {React.FC} - The SignUp component.
 */
const SignUp: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  
  /**
   * Handles form submission, sends the signup request to the server, and processes the response.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email : email, password : password }),
      });
  
      console.log("Signup response:", response);
  
      const responseText = await response.text();
      console.log("Signup response text:", responseText);
  
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log("Signup response data:", data);
          // Redirect to the login page or show a success message
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      } else {
        try {
          const error = JSON.parse(responseText);
          console.error("Error signing up:", error);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching signup response:", error);
    }
  };
    
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      padding="16px"
    >
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="50vh"
        p={3}
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
        border="1px solid black"
        borderRadius="8px"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Create your account
        </Typography>
        <TextField
          label="Email address"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            style: {
              color: theme.palette.text.secondary,
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: {
              color: theme.palette.text.secondary,
            },
          }}
        />
        <TextField
          label="Retype password"
          type="password"
          fullWidth
          margin="normal"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
          InputProps={{
            style: {
              color: theme.palette.text.secondary,
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </Box>
      <Box mt={2}>
        <Typography variant="body1">
          Already have an account?{' '}
          <Link onClick={() => navigate('/login')} fontWeight="bold">
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;