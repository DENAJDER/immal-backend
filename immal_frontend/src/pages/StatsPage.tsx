// src/pages/StatsPage.tsx
import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axiosService from "../utils/axios";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const formatStats = (data: { emotion: string; count: number }[]) => {
  const emotions = ["happy", "sad", "angry", "neutral", "surprised", "disgusted", "fearful"];
  const counts = emotions.map((e) => {
    const item = data.find((i) => i.emotion === e);
    return item ? item.count : 0;
  });
  return { labels: emotions, data: counts };
};

const StatChart = ({ label, stats }: { label: string; stats: any[] }) => {
  const formatted = formatStats(stats);

  const chartData = {
    labels: formatted.labels,
    datasets: [
      {
        label,
        data: formatted.data,
        backgroundColor: "rgba(255,255,255,0.6)",
        borderColor: "#FFD700",
        borderWidth: 2,
      },
    ],
  };

  return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />;
};

const StatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({ today: [], this_week: [], this_month: [] });

  useEffect(() => {
    axiosService
      .get("/faceai/log/stats/")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#000" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `gradient 6s ease infinite`,
        padding: "40px 20px",
        color: "#fff",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Paper
          sx={{
            maxWidth: "1000px",
            mx: "auto",
            p: 4,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(15px)",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
            Your Emotion Stats 📊
          </Typography>

          <Box sx={{ mb: 4 }}>
            <StatChart label="Today" stats={stats.today} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <StatChart label="This Week" stats={stats.this_week} />
          </Box>
          <Box sx={{ mb: 4 }}>
            <StatChart label="This Month" stats={stats.this_month} />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default StatsPage;
