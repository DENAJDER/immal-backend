// src/pages/Login.tsx
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import authSlice from "../store/slices/auth";
import { UserResponse } from "../types";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  keyframes,
} from "@mui/material";
import { motion } from "framer-motion";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
`;

function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (username: string, password: string) => {
    axios
      .post<UserResponse>(`${process.env.REACT_APP_API_URL}/auth/login/`, {
        username,
        password,
      })
      .then((res) => {
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data.user));
        setLoading(false);
        navigate("/profile");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Invalid username or password");
        setLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: (values) => {
      setLoading(true);
      handleLogin(values.username, values.password);
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required("Username is required"),
      password: Yup.string().trim().required("Password is required"),
    }),
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 6s ease infinite`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Paper
          sx={{
            padding: "40px",
            width: "100%",
            maxWidth: "420px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(15px)",
            borderRadius: "16px",
            color: "#fff",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}>
            Log in 🔐
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              {...formik.getFieldProps("username")}
              error={!!formik.errors.username && formik.touched.username}
              helperText={formik.touched.username && formik.errors.username}
              sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              {...formik.getFieldProps("password")}
              error={!!formik.errors.password && formik.touched.password}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
            />
            {message && (
              <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                {message}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #ffa500, #800080)",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(255,255,255,0.3)",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "#fff" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#FFD700", fontWeight: "bold", textDecoration: "underline" }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default Login;
