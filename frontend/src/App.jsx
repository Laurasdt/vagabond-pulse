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
import Admin from "./pages/Admin";
import "./App.scss";
import { Navigate } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      <Toaster position="bottom-center" richColors />
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
          <Route path="/gallery" element={<Gallery />} />

          <Route
            path="/admin"
            element={
              isAuthenticated && user.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
