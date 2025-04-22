import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, Paper, Avatar, CircularProgress, Grid } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { keyframes } from "@mui/material";
// Dummy users with avatars
const users = [
  { id: 1, name: "John", avatar: "https://i.pravatar.cc/50?img=1", online: true },
  { id: 2, name: "Lisa", avatar: "https://i.pravatar.cc/50?img=2", online: true },
  { id: 3, name: "Emma", avatar: "https://i.pravatar.cc/50?img=3", online: false },
  { id: 4, name: "Michael", avatar: "https://i.pravatar.cc/50?img=4", online: true },
];

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { user: "You", message, avatar: "https://i.pravatar.cc/50?img=5" };
    setMessages([...messages, newMessage]);

    setMessage("");

    // Simulated Response from a random user
    setTimeout(async () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const aiResponse = await fetchAIResponse(message);
      setMessages((prev) => [...prev, { user: randomUser.name, message: aiResponse, avatar: randomUser.avatar }]);
      scrollToBottom();
    }, 1500);
  };

  const fetchAIResponse = async (userMessage) => {
    try {
      // Disease-related AI response logic (Replace with real AI API if needed)
      const diseaseInfo = {
        "diabetes": "Diabetes is a chronic condition that affects how your body turns food into energy. Managing diet and insulin levels is key.",
        "cancer": "Cancer is the uncontrolled growth of abnormal cells in the body. Early detection improves treatment success.",
        "asthma": "Asthma causes difficulty in breathing due to inflamed airways. Inhalers help manage sudden attacks.",
        "heart disease": "Heart disease includes conditions that affect heart function, such as high blood pressure and heart attacks.",
      };

      const generalResponses = [
        "That's an interesting question!",
        "I think it's important to stay positive and take care of our health.",
        "What do you think is the best way to manage stress?",
        "We should always support each other in tough times.",
        "It's good to stay informed about our health conditions."
      ];

      return diseaseInfo[userMessage.toLowerCase()] || generalResponses[Math.floor(Math.random() * generalResponses.length)];
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Hmm, I'm not sure. What do you think?";
    }
  };


  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    25% { background-position: 50% 100%; }
    50% { background-position: 100% 50%; }
    75% { background-position: 50% 0%; }
    100% { background-position: 0% 50%; }
  `;
  return (
    
    <Box
    
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        animation: `${gradientAnimation} 6s ease infinite`,
        backgroundSize: "200% 200%",
        textAlign: "center",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
       
      }}
    >
    
      <Typography variant="h6" sx={{ opacity: 0.8, mb: 3,marginTop:"70px" }}>
        🟢 {users.filter(user => user.online).length} Users Online
      </Typography>

      {/* Online Users */}
      <Grid container spacing={1} sx={{ maxWidth: "500px", justifyContent: "center", mb: 3 }}>
        {users.map((user, index) => (
          <Grid item key={index}>
            <Avatar src={user.avatar} sx={{ width: 50, height: 50, border: user.online ? "2px solid #FFD700" : "2px solid gray" }} />
          </Grid>
        ))}
      </Grid>

      {/* Chat Box */}
      <Paper
        sx={{
          width: "80%",
          maxWidth: "600px",
          height: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          textAlign: "center",
          color: "white",
          boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.1)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: msg.user === "You" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            {msg.user !== "You" && <Avatar src={msg.avatar} />}
            <Paper
              sx={{
                padding: "10px 15px",
                borderRadius: "20px",
                background: msg.user === "You" ? "rgba(255, 215, 0, 0.9)" : "rgba(255, 255, 255, 0.2)",
                maxWidth: "75%",
                textAlign: "left",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {msg.user}
              </Typography>
              <Typography variant="body1">{msg.message}</Typography>
            </Paper>
            {msg.user === "You" && <Avatar src={msg.avatar} />}
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </Paper>

      {/* Message Input */}
      <Box sx={{ display: "flex", width: "80%", maxWidth: "600px", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            background: "white",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#FFD700" },
              "&.Mui-focused fieldset": { borderColor: "#FFD700", boxShadow: "0px 0px 10px #FFD700" },
            },
          }}
        />
        <Button variant="contained" onClick={sendMessage} sx={{ ml: 2, background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoom;
