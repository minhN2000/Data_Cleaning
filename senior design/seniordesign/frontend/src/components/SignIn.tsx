import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle sign in logic here
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
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="body1">
            Don't have an account?{' '}
            <Link href="#" onClick={() => navigate('/signup')} fontWeight="bold">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    );
  };
  
  export default SignIn;