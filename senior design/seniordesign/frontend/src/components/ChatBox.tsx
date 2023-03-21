import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSubmit = () => {
    // Add user message to messages array
    setMessages([...messages, { text: inputValue, sender: "user" }]);
    setInputValue("");

    // Process user input and generate bot response (replace with your chatbot logic)
    const botResponse = "chatbot's response";
    setMessages([...messages, { text: inputValue, sender: "user" }, { text: botResponse, sender: "bot" }]);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      height="93vh"
      padding="16px"
    >

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
            bgcolor={message.sender === "user" ? "primary.main" : "grey.300"}
            borderRadius="8px"
            display="inline-block"
            padding="8px 16px"
            margin="4px 0"
          >
            <Typography
              variant="body1"
              display="inline"
              color={message.sender === "user" ? "primary.contrastText" : "text.primary"}
            >
              {message.text}
            </Typography>
          </Box>
        </Box>
        ))}
      </Box>

      <Box
        component="form"
        display="flex"
        width="100%"
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
        />
        <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;