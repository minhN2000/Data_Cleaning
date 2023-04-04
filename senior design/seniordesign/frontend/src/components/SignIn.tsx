import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";
import { Box, TextField, Button, Typography, Link } from '@mui/material';

/**
 * Interface representing the props for the SignIn component.
 * @interface SignInProps
 * @property {(token: string, expiration: string) => void} onLoginSuccess - A function to be called after a successful login.
 */
interface SignInProps {
  onLoginSuccess: (token: string, expiration: string) => void;
}

/**
 * SignIn component for user authentication.
 * @param {SignInProps} props - The props for the SignIn component.
 * @returns {React.FC} - The SignIn component.
 */
const SignIn: React.FC<SignInProps> = ({ onLoginSuccess }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handles form submission, sends the login request to the server, and updates the state.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password : password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Update expiration for current user
        const expires = new Date(Date.now() + 36 * 60 * 1000).toISOString();

        // Update the state to set authenticated to true
        onLoginSuccess(data.token, expires);
        
        // Redirect to the chatbot page
        navigate('/', { replace: true });
      } else {
        const error = await response.json();
        console.error("Error logging in:", error.message);
      }
    } catch (error) {
      console.error("Error fetching login response:", error);
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
            Log in
          </Typography>
          <Typography variant="body1" mb={2}>
            to continue to DataCleaning
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
          <Button type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="body1">
            Don't have an account?{' '}
            <Link onClick={() =>  navigate('/signup', { replace: true })} fontWeight="bold">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    );
  };
  
  export default SignIn;