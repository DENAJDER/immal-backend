import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  keyframes,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import * as faceapi from "face-api.js";
import axiosService from "../utils/axios";

const FaceAI = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [quote, setQuote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [gameUrl, setGameUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    setIsCameraOn(true);
    setEmotion("");
    setQuote("");
    setVideoUrl("");
    setGameUrl("");
    setOpenModal(false);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const detectEmotion = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections?.expressions) {
      const detectedEmotion = Object.entries(detections.expressions).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ["neutral", 0]
      )[0];

      setEmotion(detectedEmotion);
      await generateSuggestion(detectedEmotion);
      stopCamera();
      setOpenModal(true);
    } else {
      setEmotion("No face detected");
      setQuote("");
      setVideoUrl("");
      setGameUrl("");
    }
  };

  const generateSuggestion = async (emotion: string) => {
    const quotes: Record<string, string> = {
      happy: "Happiness is contagious. Spread joy! 😊",
      sad: "Tough times don’t last, but tough people do. 💪",
      angry: "Breathe in, breathe out. Let go of anger. 🧘",
      neutral: "Stay balanced and embrace the present moment.",
      surprised: "Great things happen when you least expect them! 🎉",
      disgusted: "Turn negativity into motivation. Keep moving forward! 🚀",
      fearful: "Courage is feeling fear but pushing forward anyway. ✨",
    };

    const videos: Record<string, string> = {
      happy: "https://www.youtube.com/embed/d-diB65scQU",
      sad: "https://youtu.be/kPa7bsKwL-c",
      angry: "https://youtu.be/rYEDA3JcQqw",
      neutral: "https://www.youtube.com/embed/YQHsXMglC9A",
      surprised: "https://www.youtube.com/embed/ZbZSe6N_BXs",
      disgusted: "https://www.youtube.com/embed/KxGRhd_iWuE",
      fearful: "https://www.youtube.com/embed/yX39J_YyKbs",
    };

    const games: Record<string, string> = {
      happy: "https://www.happy-game.com",
      sad: "https://www.calming-game.com",
      angry: "https://www.meditation-game.com",
      neutral: "https://www.classic-games.com",
      surprised: "https://www.fun-games.com",
      disgusted: "https://www.positive-mind-game.com",
      fearful: "https://www.courage-game.com",
    };

    setQuote(quotes[emotion] || "Stay strong, you're doing great! 💙");
    setVideoUrl(videos[emotion] || "");
    setGameUrl(games[emotion] || "");

    try {
      await axiosService.post("/faceai/log/", { emotion });
      console.log("✅ Emotion logged to backend:", emotion);
    } catch (err: any) {
      console.warn("⚠️ Could not log emotion (probably not logged in).", err?.response?.data);
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
        animation: `${gradientAnimation} 10s ease infinite`,
        backgroundSize: "200% 200%",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: "100px 16px", sm: "60px 20px" },
      }}
    >
      <Box
        sx={{
          maxWidth: "1000px",
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
        }}
      >
        {/* 👁️ Left – Camera Box */}
        <Paper
          sx={{
            flex: 1,
            padding: { xs: "20px", sm: "30px" },
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1, fontWeight: "bold" }}>
            Face Emotion AI 🎭
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#ddd", mb: 3 }}>
            Let your face tell us how you feel — and we'll guide you with something uplifting 💫
          </Typography>

          {isCameraOn ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              />
              <Button onClick={detectEmotion} variant="contained" sx={{ mb: 1 }}>
                Detect Emotion
              </Button>
              <Button onClick={stopCamera} variant="outlined" color="error" sx={{ ml: 2 }}>
                Stop Camera
              </Button>
            </>
          ) : (
            <Button onClick={startCamera} variant="contained" sx={{ mt: 2 }}>
              Start Camera
            </Button>
          )}
        </Paper>

        {/* 🎭 Right – Emotion Guide */}
        <Paper
          sx={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            What can it detect?
          </Typography>
          <Typography>😊 Happy</Typography>
          <Typography>😢 Sad</Typography>
          <Typography>😠 Angry</Typography>
          <Typography>😶 Neutral</Typography>
          <Typography>😲 Surprised</Typography>
          <Typography>😖 Disgusted</Typography>
          <Typography>😨 Fearful</Typography>

          <Divider sx={{ my: 2, borderColor: "#FFD700" }} />

          <Typography variant="body2" sx={{ color: "#ccc" }}>
            We’ll suggest relaxing videos, quotes, and games based on what your face expresses.
          </Typography>
        </Paper>
      </Box>

      {/* 🎬 Modal with Result */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <Box
          sx={{
            padding: { xs: "20px", sm: "30px" },
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            You're feeling <strong>{emotion}</strong> 💙
          </Typography>

          {quote && (
            <Typography variant="h6" sx={{ mt: 2, color: "#FFD700" }}>
              "{quote}"
            </Typography>
          )}

          {videoUrl && (
            <Box sx={{ mt: 3 }}>
              <iframe
                width="100%"
                height={isMobile ? "200px" : "300px"}
                src={videoUrl}
                title="Suggested Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
          )}

          {gameUrl && (
            <Button
              href={gameUrl}
              target="_blank"
              sx={{
                mt: 3,
                background: "#FFD700",
                color: "black",
                fontWeight: "bold",
                px: 4,
                py: 1,
                borderRadius: "10px",
                "&:hover": {
                  background: "#ffc107",
                },
              }}
            >
              🎮 Play a Relaxing Game
            </Button>
          )}

          <Box sx={{ mt: 4 }}>
            <Button onClick={startCamera} variant="contained" color="success" sx={{ mr: 2 }}>
              Restart Camera
            </Button>
            <Button onClick={() => setOpenModal(false)} variant="outlined" color="error">
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default FaceAI;