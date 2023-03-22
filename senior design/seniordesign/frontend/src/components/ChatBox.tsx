import React, { useState } from "react";
import { Box, TextField, Button, Typography} from "@mui/material";
import './ChatBot.css';
interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}


const ChatBox: React.FC = () => {
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const handleSubmit = async () => {
        // Add user message to messages array
        setMessages([...messages, { text: inputValue, sender: "user" }]);
        setInputValue("");
    
        // Send user message to backend and get bot response
        try {
        const response = await fetch("/get_response/", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_message: inputValue }),
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
        }
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
                onChange={(e) => {
                // Handle file change event
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

        {/* Box for user enter instruction */}
        <Box
            component="form"
            display="flex"
            width="100%"
            sx={{
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
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
            />
                <Button type="submit" variant="contained" color="primary" sx={{ ml: 0 }}>
                Submit
                </Button>
        </Box>
    </Box>
  );
};

export default ChatBox;