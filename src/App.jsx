import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import { useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Gallery from "./pages/Gallery";
import "./App.scss";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/edit-event/:eventId" element={<EditEvent />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Login />}
        />
        {/* Redirige vers la page de connexion si l'utilisateur n'est pas authentifié */}
        <Route path="/gallery" element={<Gallery />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
