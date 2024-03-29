import './App.css';
import { CssBaseline } from "@mui/material";
import { useState, useEffect } from 'react';

import ChatBox from "./components/ChatBox";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

import { yellow} from "@mui/material/colors";
import { useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";

/**
 * Main application component.
 * Handles theme, authentication and routing.
 */
function App() {

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );
  const [authenticated, setAuthenticated] = useState<boolean>(
    Boolean(localStorage.getItem('token'))
  );

  /**
   * Toggle theme mode between light and dark.
   */
  const handleThemeChange = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  /**
   * Set the authentication token in localStorage.
   * @param {string} token - The authentication token.
   */
  const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  const meta = {
    title: "Data Cleaning",
    description: "Welcome to data cleaning with Minhg Nguyen!",
  };

  /**
   * Set the expiration date for the authentication token in localStorage.
   * @param {string} expiration - The expiration date.
   */
  const setExpirationDate = (expiration: string) => {
    localStorage.setItem('expiration', expiration)
  }

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === "light" ? 'rgb(20,20,20)' : yellow[500],
      },
      text: {
        primary: themeMode === "light" ? "rgb(255,255,255)" : "rgb(20,20,20)",
        secondary: themeMode === "light" ? "rgb(20,20,20)" : "#ffffff",
      },
    },
  });

  /**
   * Check and set the authentication state based on token and expiration date in localStorage.
   */
  useEffect(() => {
    // Set session's expiration time for current user
    const token = localStorage.getItem('token');
    console.log(token)
    const expiration = localStorage.getItem('expiration')
    const currentDate = new Date(Date.now())
    if (token === "" || expiration === null) {
      setAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      console.log(authenticated)
    } else {
      const expirationDate = new Date(expiration)
      if(expirationDate > currentDate) {
        setAuthenticated(true);
        console.log(authenticated)
        console.log(expirationDate)
      } else {
        setAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        console.log(authenticated)
      }
      
    }
  }, [authenticated]);

  return (
    <HelmetProvider>
        <CssBaseline />
          <BrowserRouter>
          <Helmet>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
          </Helmet>
            <Routes>
              <Route
                path="/"
                element={
                  authenticated ? (
                    <>
                      <ThemeProvider theme={theme}>
                        <Header handleThemeChange={handleThemeChange} />
                        <ChatBox />
                        <Footer />
                      </ThemeProvider>
                    </>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="/signup" element={<SignUp />} />
              <Route 
                path="/login" 
                element={
                  <SignIn onLoginSuccess={(token, expiration) => {
                    setAuthenticated(true);
                    setAuthToken(token);
                    setExpirationDate(expiration);
                  }} 
                  />
                } 
              />
            </Routes>
          </BrowserRouter>
    <HelmetProvider/>
  );
}

export default App;
