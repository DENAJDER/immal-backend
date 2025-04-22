import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import logo from "../assets/logo.png";

const Navbar = () => {
  const account = useSelector((state: RootState) => state.auth.account);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    "Face AI",
    "Entertainment",
    "Chat Community",
    "Search",
    account ? "Profile" : "Login",
  ];

  return (
    <AppBar
      sx={{
        background: "rgba(0, 0, 0, 0.4)",
        boxShadow: "none",
        transition: "top 0.3s ease-in-out",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "auto",
          marginBottom: "-25px",
          padding: "10px 20px",
        }}
      >
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.1 }}>
          <Link to="/">
            <img
              src={logo}
              alt="Immal Logo"
              style={{
                marginRight: "90px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
              }}
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        {!isMobile ? (
          <Box sx={{ display: "flex", gap: "80px" }}>
            {navItems.map((item, index) => (
              <motion.div
                whileHover={{ scale: 1.1 }}
                key={index}
                style={{
                  position: "relative",
                  padding: "5px 0",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <Button
                  component={Link}
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  sx={{
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    position: "relative",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "#FFD700",
                    },
                  }}
                >
                  {item}
                </Button>

                <motion.div
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    left: "50%",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#FFD700",
                    transform: "translateX(-50%) scale(0)",
                  }}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            ))}
          </Box>
        ) : (
          <>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  background: "rgba(0, 0, 0, 0.8)",
                  backdropFilter: "blur(8px)",
                },
              }}
            >
              <List>
                {navItems.map((item, index) => (
                  <ListItem
                    button
                    key={index}
                    component={Link}
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                        textTransform: "uppercase",
                        color: "white",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
