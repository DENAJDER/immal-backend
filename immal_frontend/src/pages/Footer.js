import React from "react";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  keyframes,
} from "@mui/material";
import { Instagram, Facebook, YouTube } from "@mui/icons-material";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
`;

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 6s ease infinite`,
        padding: "40px 20px 50px",
        textAlign: "center",
        mt: "auto",
      }}
    >
      {/* Icons always in one row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // wraps only if screen is extremely narrow
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mb: 2,
        }}
      >
        <IconButton
          href="https://www.instagram.com/immal_platform?igsh=bnFocWFjZ2Q0cnI5"
          target="_blank"
          sx={{
            color: "white",
            "&:hover": { color: "#FFD700", transform: "scale(1.2)" },
            transition: "all 0.3s ease",
          }}
        >
          <Instagram sx={{ fontSize: 32 }} />
        </IconButton>
        
        
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "white",
          opacity: 0.8,
          fontSize: { xs: "12px", sm: "14px" },
        }}
      >
       Denajdër Bardhi. All Rights Reserved. <br></br>  © {new Date().getFullYear()} 
      </Typography>
    </Box>
  );
};

export default Footer;
