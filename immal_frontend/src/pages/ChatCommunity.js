import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/material";

const chatGroups = [
  { name: "Diabetes Support", description: "Connect with people managing diabetes.", link: "diabetes" },
  { name: "Mental Health", description: "Discuss anxiety, depression, and well-being.", link: "mental-health" },
  { name: "Cancer Fighters", description: "Support and stories for cancer patients.", link: "cancer" },
  { name: "Chronic Pain", description: "Share experiences and relief techniques.", link: "chronic-pain" },
];

const ChatCommunity = () => {
  const navigate = useNavigate(); // ✅ Use this to navigate to the chat rooms

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
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h3" sx={{ marginTop:"60px",fontWeight: "bold", mb: 3, textTransform: "uppercase", letterSpacing: "2px" }}>
          💬 Join a Chat Community
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.8, mb: 5 }}>
          Choose a group and start chatting in a supportive environment.
        </Typography>
      </motion.div>

      {/* Chat Group Boxes */}
      <Grid container spacing={4} sx={{ maxWidth: "1100px", justifyContent: "center" }}>
        {chatGroups.map((group, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255, 215, 0, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                sx={{
                  padding: "35px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "16px",
                  textAlign: "center",
                  color: "white",
                  boxShadow: "0px 5px 15px rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  {group.name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                  {group.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/chat-room/${group.link}`)} // ✅ Navigate to specific chat room
                  sx={{
                    background: "linear-gradient(135deg, #FFD700, #FFA500)",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "12px 25px",
                    borderRadius: "30px",
                    transition: "all 0.3s ease",
                    "&:hover": { background: "linear-gradient(135deg, #FFA500, #FF4500)", transform: "scale(1.05)" },
                  }}
                >
                  Join Now
                </Button>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChatCommunity;
