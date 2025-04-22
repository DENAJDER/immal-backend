import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Entertainment from "./pages/Entertainment";
import Navbar from "./pages/Navbar"; 
import Footer from "./pages/Footer";
import FaceAI from "./pages/FaceAI";
import ChatRoom from "./pages/ChatRoom";
import ChatCommunity from "./pages/ChatCommunity";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import "./App.css";
import Register from "./pages/Register";
import CommunityPage from "./pages/CommunityPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import StatsPage from "./pages/StatsPage";


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Navbar />
          <Routes>
            <Route path ='login' element={<Login/>} />
            <Route path="register" element={<Register/>}/>
            <Route path="/stats" element={<StatsPage />} />

            {/* 🛡️ Only authenticated users see profile */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* 🌐 Public pages */}
            <Route path="/chat-community" element={<CommunityPage />} />
<Route path="/question/:id" element={<QuestionDetailPage />} />

            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/entertainment" element={<Entertainment />} />
            <Route path="/face-ai" element={<FaceAI />} />
            

          </Routes>
          <Footer />
        </Router>
      </PersistGate>
    </Provider>
  );
}
