import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, CircularProgress,
  Grid, ToggleButton, ToggleButtonGroup, keyframes, useTheme, useMediaQuery
} from "@mui/material";
import { Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import authSlice from "../store/slices/auth";
import axiosService from "../utils/axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
`;

const Profile = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [view, setView] = useState("today");
  const [stats, setStats] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [topEmotion, setTopEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = () => {
      axiosService
        .get("/faceai/log/stats/")
        .then((res) => {
          setStats(res.data[view] || []);
          setTrendData(res.data.trend || []);
          setStreak(res.data.weekly_streak || 0);
          setTopEmotion(res.data.top_emotion || null);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [view]);

  const formatPieStats = (data: { emotion: string; count: number }[]) => {
    const emotions = ["happy", "sad", "angry", "neutral", "surprised", "disgusted", "fearful"];
    const labels: string[] = [];
    const counts: number[] = [];

    emotions.forEach((e) => {
      const found = data.find((item) => item.emotion === e);
      if (found) {
        labels.push(e.charAt(0).toUpperCase() + e.slice(1));
        counts.push(found.count);
      }
    });

    return { labels, counts };
  };

  const pie = formatPieStats(stats);

  const pieData = {
    labels: pie.labels,
    datasets: [
      {
        data: pie.counts,
        backgroundColor: [
          "#f39c12", "#3498db", "#e74c3c",
          "#9b59b6", "#1abc9c", "#2ecc71", "#e67e22"
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const emotionColors = {
    happy: "#f39c12",
    sad: "#3498db",
    angry: "#e74c3c",
    neutral: "#9b59b6",
    surprised: "#1abc9c",
    disgusted: "#2ecc71",
    fearful: "#e67e22"
  };

  const lineData = {
    labels: trendData.map((t: any) => t.date),
    datasets: Object.keys(emotionColors).map((emotion) => ({
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      data: trendData.map((t: any) => t[emotion] || 0),
      borderColor: emotionColors[emotion as keyof typeof emotionColors],
      backgroundColor: emotionColors[emotion as keyof typeof emotionColors],
      fill: false,
      tension: 0.3,
    })),
  };

  if (!account) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="white">Loading or Not Authenticated</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 6s ease infinite`,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: isMobile ? "80px 10px 20px" : "120px 20px 40px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ width: "100%", maxWidth: "1200px" }}
      >
        <Grid container spacing={4}>
          {/* LEFT: Profile Info */}
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                padding: "30px",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                color: "#fff",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                👤 {account.username}
              </Typography>

              <Typography><strong>Email:</strong> {account.email}</Typography>
              <Typography><strong>User ID:</strong> {account.id}</Typography>
              {account.birthdate && <Typography><strong>Birthdate:</strong> {account.birthdate}</Typography>}
              {account.country && <Typography><strong>Country:</strong> {account.country}</Typography>}
              {Array.isArray(account.diseases) && account.diseases.length > 0 && (
                <Typography><strong>Diseases:</strong> {account.diseases.join(", ")}</Typography>
              )}

              <Button
                onClick={handleLogout}
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  background: "red",
                  fontWeight: "bold",
                  borderRadius: "30px",
                  "&:hover": { background: "#cc0000" },
                }}
              >
                Logout
              </Button>
            </Paper>
            {/* Add this block at the top of your LEFT Grid (before user info) */}

            <Box sx={{ mt: 3, textAlign: "center" }}>
  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#76ff03", mb: 1 }}>
    🏆 Weekly Achievement
  </Typography>
  <Typography variant="h3">
    {streak >= 6 ? "🥇" : streak >= 3 ? "🥈" : streak >= 1 ? "🥉" : "🔒"}
  </Typography>
</Box>

<Box sx={{ mt: 3, textAlign: "center" }}>
  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFD700", mb: 1 }}>
    😄 Top Emotion
  </Typography>
  <Typography variant="h3">
    {topEmotion === "happy" ? "😄" :
     topEmotion === "sad" ? "😢" :
     topEmotion === "angry" ? "😡" :
     topEmotion === "neutral" ? "😐" :
     topEmotion === "surprised" ? "😲" :
     topEmotion === "disgusted" ? "🤢" :
     topEmotion === "fearful" ? "😨" : "❓"}
  </Typography>
</Box>


          </Grid>
          

          {/* RIGHT: Emotion Stats */}
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                padding: "30px",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                color: "#fff",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Emotion Stats – {view === "today" ? "Today" : view === "this_week" ? "This Week" : "This Month"}
              </Typography>

              <ToggleButtonGroup
                color="primary"
                value={view}
                exclusive
                onChange={(e, newView) => newView && setView(newView)}
                sx={{ mb: 3 }}
              >
                <ToggleButton value="today">Today</ToggleButton>
                <ToggleButton value="this_week">This Week</ToggleButton>
                <ToggleButton value="this_month">This Month</ToggleButton>
              </ToggleButtonGroup>

              {loading ? (
                <CircularProgress />
              ) : pie.counts.length > 0 ? (
                <>
                  <Box sx={{ width: "100%", maxWidth: "500px", mx: "auto" }}>
                    <Pie data={pieData} />
                  </Box>

                  {topEmotion && (
                    <Typography variant="h6" sx={{ mt: 3, color: "#FFD700", fontWeight: "bold", textAlign: "center" }}>
                      🏅 Top Emotion of the Week: {topEmotion.charAt(0).toUpperCase() + topEmotion.slice(1)}
                    </Typography>
                  )}

                  <Typography variant="body1" sx={{ mt: 1, textAlign: "center" }}>
                    🔥 You've logged emotions {streak} day{streak !== 1 ? "s" : ""} in a row!
                  </Typography>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
                      📈 7-Day Emotion Trend
                    </Typography>
                    <Line data={lineData} />
                  </Box>
                </>
              ) : (
                <Typography>No emotions detected yet.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Profile;
