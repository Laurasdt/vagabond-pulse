import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/CreateEvent.scss";

const CreateEvent = () => {
  const { isAuthenticated } = useAuth();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Événement créé avec succès !");
    setEventData({ title: "", date: "", location: "", description: "" });
  };

  return (
    <main className="create-event">
      <h2>Créer un événement</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Nom de l'événement :
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date :
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Lieu :
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description :
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Créer l'événement</button>
      </form>
    </main>
  );
};

export default CreateEvent;
