import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  keyframes,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axiosService from "../utils/axios";

type Answer = {
  id: number;
  user: string;
  body: string;
  created_at: string;
};

type Question = {
  id: number;
  title: string;
  body: string;
  user: string;
  category: string;
  created_at: string;
  answers: Answer[];
};

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
`;

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    axiosService
      .get(`/community/questions/${id}/`)
      .then((res) => setQuestion(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const postAnswer = async () => {
    if (!answerText.trim()) return;
    setPosting(true);
    try {
      await axiosService.post(`/community/questions/${id}/answer/`, {
        body: answerText,
      });
      setAnswerText("");
      window.location.reload();
    } catch (err) {
      alert("Failed to post answer.");
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="white">
          Question not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 10s ease infinite`,
        padding: { xs: "110px 16px 40px", sm: "120px 30px 60px" },
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 4, md: 6 },
      }}
    >
      {/* Left – Answer Form */}
      <motion.div
        style={{ flex: 1, minWidth: "320px" }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          sx={{
            padding: "30px",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            💬 Share your answer
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Write your experience or support here..."
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                color: "#fff",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#FFD700",
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            disabled={posting}
            onClick={postAnswer}
            sx={{
              background: "linear-gradient(135deg, #ffd700, #800080)",
              fontWeight: "bold",
              py: 1.3,
              "&:hover": {
                background: "linear-gradient(135deg, #ffc107, #a020f0)",
              },
            }}
          >
            {posting ? <CircularProgress size={22} color="inherit" /> : "Post Answer"}
          </Button>
        </Paper>
      </motion.div>

      {/* Right – Question + Answers */}
      <motion.div
        style={{ flex: 2, minWidth: "320px" }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          sx={{
            padding: "30px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
            {question.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#ccc", mb: 3 }}>
            {question.user || "Anonymous"} – {question.category} –{" "}
            {new Date(question.created_at).toLocaleDateString()}
          </Typography>
          <Typography sx={{ mb: 4, fontSize: "16px", lineHeight: "1.7" }}>
            {question.body}
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            🗨️ Answers ({question.answers.length})
          </Typography>

          {question.answers.length === 0 ? (
            <Typography>No answers yet. Be the first to support!</Typography>
          ) : (
            question.answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Paper
                  sx={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    padding: "15px 20px",
                    mb: 2,
                    borderRadius: "14px",
                    color: "#fff",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                    {a.user || "Anonymous"} –{" "}
                    {new Date(a.created_at).toLocaleString()}
                  </Typography>
                  <Typography>{a.body}</Typography>
                </Paper>
              </motion.div>
            ))
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default QuestionDetailPage;
