import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  keyframes,
} from "@mui/material";
import { motion } from "framer-motion";
import { Element, scroller } from "react-scroll";
import axios from "axios";
import logo from "../assets/logo.png";


const scrollToSection = (section) => {
  scroller.scrollTo(section, {
    duration: 800,
    delay: 0,
    smooth: "easeInOutQuart",
  });
};

const floatingAnimation = {
  initial: { y: -10 },
  animate: { y: 10 },
  transition: {
    repeat: Infinity,
    duration: 3,
    ease: "easeInOut",
    repeatType: "mirror",
  },
};

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 100%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 0%; }
  100% { background-position: 0% 50%; }
`;

const useTypingEffect = (texts, speed = 100, delay = 2000) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (charIndex < texts[index].length) {
          setText((prev) => prev + texts[index][charIndex]);
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (charIndex > 0) {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      }
    };

    const typingInterval = setTimeout(handleTyping, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(typingInterval);
  }, [text, charIndex, isDeleting, index, texts, speed, delay]);

  return text;
};

const Home = () => {
  const typingText = useTypingEffect(
    ["WELCOME TO IMMAL", "CONNECTING HEARTS. HEALING MINDS."],
    100,
    1500
  );
  const [quotes, setQuotes] = useState([]);
  const [visibleQuotes, setVisibleQuotes] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/quotes/")
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setQuotes(response.data);
          setVisibleQuotes(response.data.slice(0, 6));
        } else {
          console.error("No quotes found or wrong format.");
        }
      })
      .catch((error) => console.error("Error fetching quotes:", error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleQuotes((prevQuotes) => {
        const currentIndex = quotes.findIndex(
          (q) => q.text === prevQuotes[0]?.text
        );
        const nextIndex = (currentIndex + 6) % quotes.length;
        return quotes.slice(nextIndex, nextIndex + 6);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa500, #800080, #008000)",
        backgroundSize: "200% 200%",
        animation: `${gradientAnimation} 6s ease infinite`,
        textAlign: "center",
        color: "#ffffff",
        overflowX: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        position: "relative",
      }}
    >
      <Box id="first-section" sx={{ position: "relative", minHeight: "100vh" }}>
        {/* QUOTES - MOBILE ONLY */}
        {isMobile && visibleQuotes[0] && (
          <motion.div
            {...floatingAnimation}
            style={{
              position: "absolute",
              top: "150px",
              left: "20%",
              transform: "translateX(-50%)",
              maxWidth: "260px",
              padding: "12px",
              borderRadius: "39px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#ffffff",
              fontSize: "14px",
              fontStyle: "italic",
              boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.3)",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            {visibleQuotes[0]?.text}
          </motion.div>
        )}

        {/* LOGO */}
        <motion.img
          src={logo}
          alt="Immal Logo"
          style={{
            width: isMobile ? "250px" : "400px",
            height: isMobile ? "250px" : "400px",
            marginTop: isMobile ? "300px" : "130px",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />

        {/* TYPING TEXT */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginTop: "20px",
            minHeight: "40px",
            px: 2,
          }}
        >
          {typingText}
        </Typography>

        {/* SECOND QUOTE - MOBILE ONLY */}
        {isMobile && visibleQuotes[1] && (
          <motion.div
            {...floatingAnimation}
            style={{
              position: "absolute",
              bottom: "150px",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "260px",
              padding: "12px",
              borderRadius: "39px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#ffffff",
              fontSize: "14px",
              fontStyle: "italic",
              boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.3)",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            {visibleQuotes[1]?.text}
          </motion.div>
        )}

        {/* QUOTES DESKTOP */}
        {!isMobile &&
          visibleQuotes.map((quote, index) => (
            <motion.div
              key={index}
              {...floatingAnimation}
              style={{
                position: "absolute",
                top: `${20 + index * 11}%`,
                left: index % 2 === 0 ? "5%" : "78%",
                maxWidth: "250px",
                padding: "15px",
                borderRadius: "39px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                fontSize: "16px",
                fontStyle: "italic",
                boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.3)",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              {quote.text}
            </motion.div>
          ))}
      </Box>

      <Element name="face-ai">
  <Container sx={{ ...sectionStyle }}>
    <SectionTitle
      title="Try the New AI Face Detection"
      subtitle="Identify facial expressions and emotions in real-time."
      buttonText="Try Now"
      buttonLink="/face-ai"
    />
    <ImageRow
      images={[
        require("../assets/Face_AI_Immal.png"),
        
      ]}
      isMobile={isMobile}
    />
  </Container>
</Element>

      {/* SECTIONS (unchanged but with smaller images on mobile) */}
      <Element name="search">
  <Container sx={{ ...sectionStyle }}>
    <SectionTitle
      title="Try the New AI Disease Search"
      subtitle="Instant, AI-powered search for better healthcare decisions."
      buttonText="Try Now"
      buttonLink="/search"
    />
    <ImageRow
      images={[
        require("../assets/search.png")
        
      ]}
      isMobile={isMobile}
    />
  </Container>
</Element>


      <Element name="entertainment">
  <Container sx={{ ...sectionStyle }}>
    <SectionTitle
      title="Discover Entertainment Like Never Before"
      subtitle="Games, music, and relaxation – all in one place."
      buttonText="Try Now"
      buttonLink="/entertainment"
    />
    <ImageRow
      images={[
        require("../assets/entertainment.png"),
        
      ]}
      isMobile={isMobile}
    />
  </Container>
</Element>


<Element name="community">
  <Container sx={{ ...sectionStyle }}>
    <SectionTitle
      title="Stay Connected. Stay Supported."
      subtitle="Join thousands in a safe and supportive space."
      buttonText="Join Now"
      buttonLink="/community"
    />
    <ImageRow
      images={[
        require("../assets/community.png"),
      ]}
      isMobile={isMobile}
    />
  </Container>
</Element>

    </Box>
  );
};

const sectionStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "80px 20px",
};

const SectionTitle = ({ title, subtitle, buttonText, buttonLink }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ opacity: 0.8, mb: 4 }}>
      {subtitle}
    </Typography>
    <Button
      variant="contained"
      component={Link}
      to={buttonLink}
      sx={{
        background: "black",
        color: "white",
        fontWeight: "bold",
        fontSize: "18px",
        padding: "12px 24px",
        borderRadius: "30px",
        transition: "all 0.3s ease",
        "&:hover": { background: "#333", transform: "scale(1.05)" },
      }}
    >
      {buttonText}
    </Button>
  </motion.div>
);

const ImageRow = ({ images, isMobile }) => (
  <Box sx={{ display: "flex", gap: "20px", mt: 6, flexWrap: "wrap", justifyContent: "center" }}>
    {images.map((img, index) => (
      <motion.img
        key={index}
        src={img}
        alt=""
        style={{
          width: isMobile ? "300px" : "450px",
          borderRadius: "15px",
        }}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      />
    ))}
  </Box>
);

export default Home;
