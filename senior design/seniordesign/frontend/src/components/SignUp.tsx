import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Retype password"
          type="password"
          fullWidth
          margin="normal"
          value={retypePassword}
          onChange={(e) => setRetypePassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </Box>
      <Box mt={2}>
        <Typography variant="body1">
          Already have an account?{' '}
          <Link href="#" onClick={() => navigate('/login')} fontWeight="bold">
            Sign In
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;