import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import authSlice from "../store/slices/auth";
import { UserResponse } from "../types";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { motion } from "framer-motion";
import { keyframes } from "@mui/material";

const diseaseOptions = ["Diabetes", "Cancer", "Heart Disease", "Asthma", "Mental Health"];

const Register = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      const names = res.data.map((c: any) => c.name.common).sort();
      setCountries(names);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      birthdate: "",
      country: "",
      diseases: [] as string[],
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Min 6 characters").required("Required"),
      birthdate: Yup.date().required("Required"),
      country: Yup.string().required("Required"),
      diseases: Yup.array().min(1, "Select at least one"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post<UserResponse>(
          `${process.env.REACT_APP_API_URL}/auth/register/`,
          values
        );
        dispatch(authSlice.actions.setAuthTokens({
          token: res.data.access,
          refreshToken: res.data.refresh,
        }));
        dispatch(authSlice.actions.setAccount(res.data.user));
        navigate("/profile");
      } catch (err: any) {
        console.error(err);
        setMessage(err.response?.data?.detail || "Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 6s ease infinite`,
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
            Sign Up 📝
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
              label="Email"
              type="email"
              variant="outlined"
              {...formik.getFieldProps("email")}
              error={!!formik.errors.email && formik.touched.email}
              helperText={formik.touched.email && formik.errors.email}
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

            <TextField
              fullWidth
              label="Birthdate"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...formik.getFieldProps("birthdate")}
              error={!!formik.errors.birthdate && formik.touched.birthdate}
              helperText={formik.touched.birthdate && formik.errors.birthdate}
              sx={{ mb: 2, input: { color: "#fff" }, label: { color: "#fff" } }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#fff" }}>Country</InputLabel>
              <Select
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="country"
                label="Country"
                input={<OutlinedInput label="Country" />}
                sx={{ color: "#fff" }}
              >
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
              {formik.touched.country && formik.errors.country && (
                <Typography color="error" fontSize={12}>{formik.errors.country}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#fff" }}>Diseases</InputLabel>
              <Select
                multiple
                name="diseases"
                value={formik.values.diseases}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                input={<OutlinedInput label="Diseases" />}
                renderValue={(selected) => selected.join(", ")}
                sx={{ color: "#fff" }}
              >
                {diseaseOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    <Checkbox checked={formik.values.diseases.indexOf(d) > -1} />
                    <ListItemText primary={d} />
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.diseases && formik.errors.diseases && (
                <Typography color="error" fontSize={12}>{formik.errors.diseases}</Typography>
              )}
            </FormControl>

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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;
