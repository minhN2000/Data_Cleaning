import { useTheme } from "@mui/material/styles";
import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material"; //Grid
import './ChatBot.css';
import ResponseRenderer from "./ResponseRenderer";



interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}


const ChatBox: React.FC = () => {

  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null); // handle file input
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false); // disable submit button, allow user submit 1 message per response

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setSubmitDisabled(true);

    // Add user message to messages array
    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setInputValue("");

    // Add .csv file
    const formData = new FormData();
    formData.append("user_message", inputValue);
    const file = uploadedFile
    if (file) {
      formData.append("file", file);
    }

    // Send user message to backend and get bot response
    try {
      const response = await fetch("/get_response/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const botResponse = data.answer;

      // Update messages array with bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setSubmitDisabled(false);
    }
  };

  useEffect(() => {
    const resetPrevFileName = async () => {
      try {
        await fetch("/reset_prev_file_name/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error resetting prev_file_name:", error);
      }
    };

    resetPrevFileName();
  }, []);

  return (
    <Box
      bgcolor='background.paper'
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      height="93vh"
      padding="0px"
    >
      {/* Box display uploaded file */}
      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="30%"
        height="60px"
        bgcolor="background.paper"
        borderRadius="8px"
        margin="16px 0"
        sx={{ border: "1px solid grey" }}
        onSubmit={(e) => {
          e.preventDefault();
          // Handle file upload logic here
        }}
      >
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{
            color: theme.palette.text.secondary,
          }}
        />
      </Box>

      {/* Box display content */}
      <Box
        component="ul"
        flexGrow={1}
        width="100%"
        overflow="auto"
        bgcolor="background.paper"
        borderRadius="8px"
        padding="16px"
        margin="16px 0"
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            component="ul"
            textAlign={message.sender === "user" ? "right" : "left"}
          >
            <Box
              bgcolor={message.sender === "user" ? "primary.main" : "grey.500"}
              borderRadius="8px"
              display="inline-block"
              padding="8px 16px"
              margin="4px 0"
              className="message-container"
            >
              <Typography
                variant="body1"
                display="inline"
                color={message.sender === "user" ? "text.primary" : "text.secondary"}
              >
                {message.sender === "user" ? ( 
                  message.text
                ) : (
                  // message.text
                  <ResponseRenderer response={message.text} />
                )}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Box for user enter instruction */}
      <Box
        component="form"
        display="flex"
        width="100%"
        sx={{
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          border: theme.palette.mode === 'dark' ? '1px dashed' :'none'
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            style: {
              color: theme.palette.text.secondary,
            },
          }}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ ml: 0 }} disabled={submitDisabled}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;

// function getCookie(name: string): string | null {
//     const value = "; " + document.cookie;
//     const parts = value.split("; " + name + "=");
//     if (parts.length === 2) {
//       const cookieValue = parts.pop()?.split(";").shift();
//       return cookieValue ? cookieValue : null;
//     }
//     return null;
//   }