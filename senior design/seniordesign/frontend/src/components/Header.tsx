import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from "@mui/material/styles";

interface HeaderProps {
    handleThemeChange: () => void;
  }

  
const Header: React.FC<HeaderProps> = ({ handleThemeChange }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Box 
        display="flex" 
        justifyContent="flex-start" 
        alignItems="center" 
        padding="16px"
        sx={{
            // bgcolor: 'rgb(245,245,245)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }}
        >
            <Typography variant="h4">Data Cleaning</Typography>
            <IconButton onClick={handleThemeChange}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Box>
    );
    };

export default Header;