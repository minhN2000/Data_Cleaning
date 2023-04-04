import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from "@mui/material/styles";

/**
 * HeaderProps interface for the Header component.
 * @typedef {Object} HeaderProps
 * @property {() => void} handleThemeChange - Function to toggle the theme.
 */
interface HeaderProps {
    handleThemeChange: () => void;
  }

/**
 * Header component that displays the app title and a theme toggle button.
 * @param {HeaderProps} props - Properties passed to the Header component: theme.
 * @returns {React.FC} - The Header component.
 */
const Header: React.FC<HeaderProps> = ({ handleThemeChange }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Box 
        bgcolor='background.paper'
        display="flex" 
        justifyContent="flex-start" 
        alignItems="center" 
        padding="16px"
        width='100%'
        sx={{
            // bgcolor: 'rgb(245,245,245)',
            boxShadow: '0 2px 4px rgba(0, 255, 255, 0.8)'
        }}
        >
            <Typography variant="h4"
                color= "text.secondary"
                style={{
                    fontWeight: 'bold',
                    fontFamily: 'segoe ui historic'
                }}
            >
                Data Cleaning
            </Typography>
            <IconButton onClick={handleThemeChange}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </Box>
    );
    };

export default Header;