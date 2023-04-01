import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const Footer: React.FC = () => {
  const theme = useTheme();
  return (
    <Box bgcolor='text.primary' display="flex" justifyContent="center" alignItems="center" padding="16px">
      <Typography
        variant="body1"
        color = {theme.palette.text.secondary}
      >
        Senior Design - Authenticated by Minh Nguyen</Typography>
    </Box>
  );
};

export default Footer;