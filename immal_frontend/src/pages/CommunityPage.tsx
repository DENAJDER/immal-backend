import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, Button, CircularProgress,
  MenuItem, Select, InputLabel, FormControl, keyframes
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axiosService from "../utils/axios";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

type Question = {
  id: number;
  title: string;
  body: string;
  user: string;
  category: string;
  created_at: string;
};

const categories = ["All", "Diabetes", "Cancer", "Mental Health", "Heart Disease", "Asthma"];

const CommunityPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filtered, setFiltered] = useState<Question[]>([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", body: "", category: "" });

  useEffect(() => {
    setLoading(true);
    axiosService.get(`/community/questions/?page=${page}`)
      .then((res) => {
        setQuestions(res.data.results);
        setFiltered(res.data.results);
        setHasNext(res.data.next !== null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    if (selectedCat === "All") setFiltered(questions);
    else setFiltered(questions.filter(q => q.category === selectedCat));
  }, [selectedCat, questions]);

  const handlePost = async () => {
    if (!newQuestion.title || !newQuestion.body || !newQuestion.category) return;
    setPosting(true);
    try {
      await axiosService.post("/community/questions/", newQuestion);
      setNewQuestion({ title: "", body: "", category: "" });
      window.location.reload();
    } catch (err) {
      alert("Failed to post question.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 12s ease infinite`,
        paddingTop: "110px",
        paddingX: { xs: 2, sm: 4 },
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      {/* 🌈 Category Filter Above Questions */}
      <Paper
        sx={{
          width: "100%",
          maxWidth: "850px",
          mb: 4,
          px: 3,
          py: 2,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#fff" }}>Filter by Category</InputLabel>
          <Select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            sx={{
              color: "#fff",
              "& .MuiSvgIcon-root": { color: "#fff" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.4)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FFD700",
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* 💬 Post Question Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%", maxWidth: "850px" }}
      >
        <Paper
          sx={{
            mt: 0,
            p: 4,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
            Ask the Community 💬
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: "#fff" }}>Category</InputLabel>
            <Select
              value={newQuestion.category}
              name="category"
              onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
              sx={{ color: "#fff", "& .MuiSvgIcon-root": { color: "#fff" } }}
            >
              {categories.slice(1).map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Title"
            name="title"
            id="title"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#fff" },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&:hover fieldset': { borderColor: '#FFD700' },
              },
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Body"
            name="body"
            id="body"
            value={newQuestion.body}
            onChange={(e) => setNewQuestion({ ...newQuestion, body: e.target.value })}
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#fff" },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                '&:hover fieldset': { borderColor: '#FFD700' },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handlePost}
            disabled={posting}
            sx={{
              background: "linear-gradient(135deg, #ffd700, #ff69b4)",
              py: 1.5,
              fontWeight: "bold",
              color: "#000",
              "&:hover": {
                background: "linear-gradient(135deg, #ffc107, #ff1493)",
              },
            }}
          >
            {posting ? <CircularProgress size={22} color="inherit" /> : "Post Question"}
          </Button>
        </Paper>
      </motion.div>

      {/* 📄 Filtered Questions List */}
      <Box sx={{ mt: 6, maxWidth: "850px", mx: "auto", width: "100%" }}>
        {loading ? (
          <CircularProgress />
        ) : filtered.length === 0 ? (
          <Typography mt={3}>No questions in this category yet.</Typography>
        ) : (
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
            {filtered.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Paper
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    padding: "20px",
                    mb: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <Typography variant="h6">{q.title}</Typography>
                  <Typography variant="body2" sx={{ color: "#ddd", mb: 1 }}>
                    By {q.user || "Anonymous"} – {q.category} – {new Date(q.created_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{q.body}</Typography>
                  <Link to={`/question/${q.id}`} style={{ color: "#FFD700", fontWeight: "bold" }}>
                    View Answers →
                  </Link>
                </Paper>
              </motion.div>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4, mb: 4 }}>
        {page > 1 && <Button onClick={() => setPage(page - 1)}>⬅ Prev</Button>}
        {hasNext && <Button onClick={() => setPage(page + 1)} sx={{ ml: 2 }}>Next ➡</Button>}
      </Box>
    </Box>
  );
};

export default CommunityPage;
