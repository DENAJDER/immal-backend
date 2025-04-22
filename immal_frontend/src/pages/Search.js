import React, { useState, useEffect } from "react";
import {
  TextField, Box, Typography, Grid, Paper,
  InputAdornment, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { motion } from "framer-motion";

const Search = () => {
  const [query, setQuery] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Search for Diseases 🧬";

  // ✨ Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setAnimatedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/search/?query=${query}`);
      setDiseases(response.data.diseases || []);
    } catch (err) {
      setError("No diseases found.");
      setDiseases([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: "bgShift 10s ease infinite",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: diseases.length > 0 ? "80px" : "25vh",
        paddingBottom: "120px",
        paddingX: "20px",
        boxSizing: "border-box",
      }}
    >
      <style>
        {`
          @keyframes bgShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @media (max-width: 768px) {
            .type-text {
              font-size: 1.8rem !important;
            }
          }
        `}
      </style>
<br></br><br></br><br></br><br></br><br></br>
      {/* 🖊️ Animated Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h4"
          className="type-text"
          sx={{
            mb: 4,
            fontWeight: "bold",
            textAlign: "center",
            color: "#fff",
            textTransform: "uppercase",
            fontSize: "2.3rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {animatedText}
        </Typography>
      </motion.div>

      {/* 🔍 Search Input */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <TextField
          variant="outlined"
          placeholder="Search a disease by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{
            width: "100%",
            maxWidth: "600px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "12px",
            backdropFilter: "blur(8px)",
            input: {
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "#FFD700" },
              "&.Mui-focused fieldset": {
                borderColor: "#FFD700",
                boxShadow: "0 0 10px #FFD700",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#fff" }} />
              </InputAdornment>
            ),
          }}
        />
      </motion.div>

      {loading && <CircularProgress sx={{ color: "#FFD700", mt: 4 }} />}
      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* 💊 Result Cards */}
      <Box
        sx={{
          mt: 6,
          width: "100%",
          maxWidth: "1300px",
          mx: "auto",
        }}
      >
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ overflowX: "hidden" }}
        >
          {diseases.map((disease, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Paper
                  sx={{
                    padding: "20px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    textAlign: "center",
                    color: "white",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <motion.img
                    src={disease.image || "https://via.placeholder.com/300"}
                    alt={disease.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                    {disease.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {disease.description || "No description provided."}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Search;
