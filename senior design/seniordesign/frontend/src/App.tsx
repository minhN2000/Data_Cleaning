// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { CssBaseline } from "@mui/material";
import ChatBox from "./components/ChatBox";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  return (
    <>
      <CssBaseline />
      <Header />
      <ChatBox />
      <Footer />
    </>
  );
}

export default App;
