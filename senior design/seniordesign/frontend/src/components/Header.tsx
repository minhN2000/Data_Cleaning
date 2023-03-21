import React from 'react';
import { Box, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Box display="flex" justifyContent="flex-start" alignItems="center" padding="16px">
      <Typography variant="h4">Data Cleaning</Typography>
    </Box>
  );
};

export default Header;