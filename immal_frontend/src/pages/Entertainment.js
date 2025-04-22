// ✅ Final Entertainment Page — Smaller Circular Sections + Hover Glow + Floating Bubbles
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  IconButton,
  keyframes,
} from "@mui/material";
import { motion, useCycle } from "framer-motion";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const playlist = [
  { title: "Peaceful Piano", url: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3" },
  { title: "Spa Dreams", url: "https://www.bensound.com/bensound-music/bensound-sweet.mp3" },
  { title: "Ocean Breeze", url: "https://www.bensound.com/bensound-music/bensound-memories.mp3" },
  { title: "Mandisa - Good Morning", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
];

const affirmations = [
  "You are enough. Keep going.",
  "Today is full of endless possibilities.",
  "You are stronger than you think.",
  "Peace begins with you.",
  "Breathe. You’ve got this.",
];

const colors = ["#FFE4E1", "#E0FFFF", "#F0FFF0", "#FFFACD", "#D8BFD8"];

const Entertainment = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [affirmation, setAffirmation] = useState(affirmations[0]);
  const [colorIndex, setColorIndex] = useState(0);
  const audioRef = useRef(new Audio(playlist[0].url));
  const timerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((i) => (i + 1) % colors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.src = playlist[trackIndex].url;
    audio.loop = false;
    audio.volume = 0.5;
    audio.muted = isMuted;

    document.addEventListener("click", () => isPlaying && audio.play().catch(() => {}), { once: true });
    isPlaying ? audio.play().catch(() => {}) : audio.pause();

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setTrackIndex((i) => (i + 1) % playlist.length), 60000);

    return () => {
      audio.pause();
      clearTimeout(timerRef.current);
    };
  }, [trackIndex, isPlaying, isMuted]);

  const getNewAffirmation = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * affirmations.length);
    } while (affirmations[newIndex] === affirmation);
    setAffirmation(affirmations[newIndex]);
  };

  const entertainmentData = {
    music: {
      title: "🎵 Music Playlist",
      content: <Typography variant="h6">Now playing: <strong>{playlist[trackIndex].title}</strong></Typography>,
    },
    breathe: {
      title: "🫧 Breathe Exercise",
      content: (
        <Box textAlign="center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              margin: "auto",
              backdropFilter: "blur(12px)",
            }}
          />
        </Box>
      ),
    },
    affirmations: {
      title: "💬 Affirmations",
      content: (
        <Box textAlign="center">
          <Typography variant="h6">{affirmation}</Typography>
          <Button onClick={getNewAffirmation} sx={{ mt: 2 }}>New Affirmation</Button>
        </Box>
      ),
    },
    colorTherapy: {
      title: "🌈 Color Therapy",
      content: (
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: "20px",
            backgroundColor: colors[colorIndex],
            transition: "background 1s ease",
            margin: "auto",
          }}
        />
      ),
    },
    games: {
      title: "🎮 Play a Fun Game",
      content: (
        <>
          <Typography variant="h6">Relax with brain-teasing activities.</Typography>
          <Button
            variant="contained"
            href="https://www.coolmathgames.com/0-brain-training"
            target="_blank"
            sx={{ mt: 2 }}
          >
            Play Now 🎮
          </Button>
        </>
      ),
    },
    stories: {
      title: "📚 Motivational Stories",
      content: (
        <Typography variant="h6" sx={{ whiteSpace: "pre-line" }}>
          🌟 Believe in Yourself
          {"\n"}A man once told a child he couldn’t be an artist. That child was Pablo Picasso.
        </Typography>
      ),
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        animation: `${gradientAnimation} 15s ease infinite`,
        backgroundSize: "200% 200%",
        px: 2,
        pt: 10,
        pb: 20,
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            bottom: -40,
            left: `${Math.random() * 100}%`,
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
          animate={{ y: -600 }}
          transition={{ duration: 15 + Math.random() * 5, repeat: Infinity, delay: i * 5.5 }}
        />
      ))}
<br></br><br></br><br></br>
      <Typography variant="h3" textAlign="center" mb={3}>✨ Explore Entertainment</Typography>
      <br></br>
      {selectedSection ? (
        <Box maxWidth={600} mx="auto">
          <Paper sx={{ p: 4, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", borderRadius: "30px" }}>
            <Typography variant="h4" mb={2}>{entertainmentData[selectedSection].title}</Typography>
            {entertainmentData[selectedSection].content}
            <Button onClick={() => setSelectedSection(null)} sx={{ mt: 3 }}>← Back</Button>
          </Paper>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {Object.entries(entertainmentData).map(([key, section], index) => (
            <Grid item key={key} xs={12} sm={6} md={4}>
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    background: "rgba(255,255,255,0.1)",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "50%",
                    backdropFilter: "blur(10px)",
                    color: "white",
                    height: "150px",
                    width: "150px",
                    margin: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setSelectedSection(key)}
                >
                  <Typography variant="h6">{section.title}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Music Controls */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton onClick={() => setIsPlaying(!isPlaying)} sx={{ color: "#fff" }}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={() => setIsMuted(!isMuted)} sx={{ color: "#fff" }}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <IconButton onClick={() => setTrackIndex((i) => (i + 1) % playlist.length)} sx={{ color: "#fff" }}>
          <SkipNextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Entertainment;
